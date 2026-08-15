import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { FileUtils } from '@zma-nestjs-omnichannel/zma-utils';
import FormData from 'form-data';
import sharp from 'sharp';

import { IDataServices } from '../../core';
import { EmitterEvent, FileStatus } from '../../core/types/enums';
import { ConfirmUploadedFilesEvent } from '../../core/types/events';
import { R2FileService } from '../../frameworks/files-services/r2/r2.file-service.service';
import { StorageUtils } from '../../utils';

const WEBP_MIME_TYPE = 'image/webp';
const WEBP_EXTENSION = 'webp';

const convertibleMimeTypes = new Set(['image/jpeg', 'image/png', 'image/bmp', 'image/tiff']);

@Injectable()
export class FileUseCaseEvent {
  private logger = new Logger(FileUseCaseEvent.name);
  private readonly virusScannerEnabled: boolean;
  private readonly virusScannerUrl: string;
  private readonly mainBucket: string;

  constructor(
    private dataServices: IDataServices,
    private configService: ConfigService,
    private readonly fileService: R2FileService,
    private readonly httpService: HttpService,
  ) {
    this.virusScannerEnabled = this.configService.get<boolean>('virusScanner.enabled', false);
    this.virusScannerUrl = this.configService.get<string>('virusScanner.url', '');
    this.mainBucket = this.configService.get<string>('bucket.image.name', '');

    // Validate required configurations
    if (this.virusScannerEnabled && !this.virusScannerUrl) {
      throw new Error('Virus scanner is enabled but virusScanner.url is not configured');
    }
    if (!this.mainBucket) {
      throw new Error('Main bucket name is required but bucket.image.name is not configured');
    }
  }

  @OnEvent(EmitterEvent.ConfirmUploadedFiles, { async: true })
  async handleConfirmUploadedFilesEvent(events: ConfirmUploadedFilesEvent[]): Promise<void> {
    this.logger.log(`Processing ${events.length} uploaded files`);

    // Batch presigned URL generation and database updates
    await this.updatePresignedUrls(events);

    // Process files sequentially to manage memory
    for (const event of events) {
      await this.processFile(event);
    }

    this.logger.log(`Completed processing ${events.length} files`);
  }

  private async updatePresignedUrls(events: ConfirmUploadedFilesEvent[]): Promise<void> {
    const presignedUrlPromises = events.map(async (event) => {
      this.logger.debug(
        `Getting presigned URL for file: ${event.fileId}, bucket: ${event.bucket}, key: ${event.key}`,
      );
      const presignedUrl = await this.fileService.getObjectPresignedUrl({
        bucket: event.bucket,
        key: event.key,
      });

      return this.dataServices.fileService.updateOne({
        id: event.fileId,
        update: { item: { tempPresignedUrl: presignedUrl } },
      });
    });

    await Promise.all(presignedUrlPromises);
  }

  private async processFile(event: ConfirmUploadedFilesEvent): Promise<void> {
    try {
      this.logger.log(`Processing file: ${event.fileId} from bucket: ${event.bucket}`);
      const fileBuffer = await this.fileService.downloadFile({
        bucket: event.bucket,
        key: event.key,
      });
      this.logger.debug(`Downloaded file: ${event.fileId}, size: ${fileBuffer.length} bytes`);

      const extension = FileUtils.detectExtension(fileBuffer).toLowerCase();
      this.logger.debug(`Detected extension: ${extension} for file: ${event.fileId}`);

      // Compare the detected extension
      if (!FileUtils.compareExtensions(extension, event.extension)) {
        this.logger.warn(
          `Extension mismatch for file: ${event.fileId}. Expected: ${event.extension}, got: ${extension}`,
        );
        await this.updateFileStatus(event.fileId, FileStatus.ExtensionError);
        return;
      }

      // Scan for viruses if enabled
      if (this.virusScannerEnabled && !(await this.isFileClean(event.fileId, fileBuffer))) {
        await this.dataServices.fileService.updateOne({
          id: event.fileId,
          update: { item: { status: FileStatus.VirusDetected, isDisabled: true } },
        });
        return;
      }

      // Process convert file
      const { compressedBuffer, confirmedExtension, confirmedMimeType } =
        await this.processConvertFile(fileBuffer, event.mimeType, extension);

      const mainKey = StorageUtils.generateBucketKey({
        fileId: event.fileId,
        extension: confirmedExtension,
      });

      const contentHash = FileUtils.hashFileContent(compressedBuffer);

      this.logger.log(
        `Uploading clean file: ${event.fileId} to permanent storage bucket: ${this.mainBucket}`,
      );
      await this.fileService.uploadFile({
        bucket: this.mainBucket,
        key: mainKey,
        mimeType: confirmedMimeType,
        file: compressedBuffer,
      });

      await this.dataServices.fileService.updateOne({
        id: event.fileId,
        update: {
          item: {
            bucket: this.mainBucket,
            key: mainKey,
            size: compressedBuffer.byteLength,
            extension: confirmedExtension,
            mimeType: confirmedMimeType,
            status: FileStatus.Confirmed,
            tempPresignedUrl: null,
            contentHash,
          },
        },
      });

      this.logger.log(`Removing temporary file: ${event.fileId} in ${event.bucket}`);
      await this.fileService.deleteFile({ bucket: event.bucket, key: event.key });
      this.logger.log(`File processing completed successfully: ${event.fileId}`);
    } catch (error) {
      this.logger.error(`Failed to process file ${event.fileId}: ${error.message}`);
      await this.updateFileStatus(event.fileId, FileStatus.Error);
    }
  }

  private async isFileClean(fileId: string, fileBuffer: Buffer): Promise<boolean> {
    this.logger.log(`Starting virus scan for file: ${fileId}`);
    const formData = new FormData();
    formData.append('FILES', fileBuffer);

    try {
      const timeout = this.configService.get<number>('virusScanner.timeout', 30000);
      const { data } = await this.httpService.axiosRef.post(this.virusScannerUrl, formData, {
        timeout,
        maxContentLength: 100 * 1024 * 1024, // 100MB limit
      });
      this.logger.debug(`Virus scan completed for file: ${fileId}, result: ${data.success}`);
      return data.success;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        this.logger.error(`Virus scan timeout for file ${fileId}`);
      } else {
        this.logger.error(`Virus scan failed for file ${fileId}: ${error.message}`);
      }
      // Consider whether to fail-safe (assume clean) or fail-secure (assume infected)
      return false; // Fail-secure: treat scan failures as potential threats
    }
  }

  private async processConvertFile(
    fileBuffer: Buffer,
    mimeType: string,
    extension: string,
  ): Promise<{ compressedBuffer: Buffer; confirmedExtension: string; confirmedMimeType: string }> {
    if (!convertibleMimeTypes.has(mimeType)) {
      return {
        compressedBuffer: fileBuffer,
        confirmedExtension: extension,
        confirmedMimeType: mimeType,
      };
    }

    const compressedBuffer = await sharp(fileBuffer)
      .webp({ quality: 80, lossless: false })
      .toBuffer();

    return {
      compressedBuffer,
      confirmedExtension: WEBP_EXTENSION,
      confirmedMimeType: WEBP_MIME_TYPE,
    };
  }

  private async updateFileStatus(fileId: string, status: FileStatus): Promise<void> {
    await this.dataServices.fileService.updateOne({
      id: fileId,
      update: { item: { status } },
    });
  }
}
