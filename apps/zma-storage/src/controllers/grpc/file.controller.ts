import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
  MicroserviceInput,
  ServiceName,
  StorageServiceSubject,
} from '@zma-nestjs-omnichannel/zma-types';
import {
  StorageServiceInputMapper,
  StorageServiceOutputMapper,
} from '@zma-nestjs-omnichannel/zma-types/mappers/storage';

import { FileUseCase } from '../../use-cases/file/file.use-case';

@Controller()
export class FileGrpcController {
  constructor(private readonly fileUseCase: FileUseCase) {}

  @GrpcMethod(ServiceName.STORAGE, StorageServiceSubject.ConfirmUploadedFiles)
  async confirmUploadedFiles(
    @Payload()
    input: MicroserviceInput<StorageServiceInputMapper<StorageServiceSubject.ConfirmUploadedFiles>>,
  ): Promise<StorageServiceOutputMapper<StorageServiceSubject.ConfirmUploadedFiles>> {
    const { data } = input;
    return {
      data: await this.fileUseCase.confirmUploadedFiles({ userId: data.userId, input: data.files }),
    };
  }
}
//
