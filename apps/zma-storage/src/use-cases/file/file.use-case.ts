import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StorageServiceConfirmUploadedFilesGqlInput } from '@zma-nestjs-omnichannel/zma-types/inputs/storage';
import { ConfirmUploadedFilesOutput } from '@zma-nestjs-omnichannel/zma-types/outputs/storage';
import { FileUtils, IdUtils } from '@zma-nestjs-omnichannel/zma-utils';
import { GraphQLError } from 'graphql';

import { IDataServices } from '../../core/abstracts';
import { StorageServicePresignedUrlGqlInput } from '../../core/inputs';
import { Presigned } from '../../core/models';
import { EmitterEvent, FileStatus } from '../../core/types/enums';
import { ConfirmUploadedFilesEvent } from '../../core/types/events';
import { R2FileService } from '../../frameworks/files-services/r2/r2.file-service.service';
import { StorageUtils } from '../../utils';

const imageSupportedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/webp',
  'image/tiff',
  'image/bmp',
]);
const WEBP_EXTENSION = 'webp';

@Injectable()
export class FileUseCase {
  constructor(
    private dataServices: IDataServices,
    private configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly fileService: R2FileService,
  ) {}

  async generatePresignedUrl({
    userId,
    input,
  }: {
    userId: string;
    input: StorageServicePresignedUrlGqlInput;
  }): Promise<Presigned> {
    const { mimeType } = input;
    if (!imageSupportedMimeTypes.has(mimeType)) {
      throw new GraphQLError(`Mime type ${mimeType} is not supported`);
    }

    const extension = FileUtils.mimeTypeToExtension(mimeType);
    const fileId = IdUtils.uuidv7();
    const bucket = this.configService.get('bucket.image.presignedName');
    const key = StorageUtils.generateBucketKey({
      fileId,
      extension,
    });

    await this.dataServices.fileService.create({
      item: {
        _id: fileId,
        extension,
        status: FileStatus.PendingUpload,
        fileName: StorageUtils.generateBucketKey({
          fileId,
          extension: WEBP_EXTENSION,
        }),
        key,
        bucket,
        mimeType,
        userId,
      },
    });

    const presignedUrl = await this.fileService.putObjectPresignedUrl({ bucket, key, mimeType });

    return { fileId, presignedUrl };
  }

  async confirmUploadedFiles({
    userId,
    input,
  }: {
    userId: string;
    input: StorageServiceConfirmUploadedFilesGqlInput[];
  }): Promise<ConfirmUploadedFilesOutput[]> {
    if (input.length > 10) {
      throw new GraphQLError('Maximum 10 files can be uploaded at once');
    }
    const bucket = this.configService.get('bucket.image.presignedName');

    const fileIds = input.map(({ fileId }) => fileId);
    const files = await this.dataServices.fileService.findManyByIds({ ids: fileIds });
    const metadataFiles = files.map(({ _id, mimeType }) => {
      const fileId = _id;
      const extension = FileUtils.mimeTypeToExtension(mimeType);
      const key = StorageUtils.generateBucketKey({
        fileId,
        extension,
      });

      return {
        fileId,
        extension,
        key,
        bucket,
        mimeType,
      };
    });

    // for (const metadataFile of metadataFiles) {
    //   const { fileId, extension, key, bucket, mimeType } = metadataFile;
    //   await this.dataServices.fileService.create({
    //     item: {
    //       _id: fileId,
    //       extension,
    //       status: FileStatus.Uploaded,
    //       fileName: StorageUtils.generateBucketKey({
    //         fileId,
    //         extension: 'webp',
    //       }),
    //       key,
    //       bucket,
    //       mimeType,
    //       userId,
    //     },
    //   });
    // }

    const events = metadataFiles.map(({ fileId, extension, mimeType, key, bucket }) => {
      const event: ConfirmUploadedFilesEvent = {
        userId,
        fileId,
        extension,
        mimeType,
        key,
        bucket,
      };
      return event;
    });
    this.eventEmitter.emit(EmitterEvent.ConfirmUploadedFiles, events);
    return input.map(({ fileId }) => ({ fileId }));
  }
}
