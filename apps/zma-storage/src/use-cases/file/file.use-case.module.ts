import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { R2FileService } from '../../frameworks/files-services/r2/r2.file-service.service';
import { DataServicesModule } from '../../services/data-services/data-services.module';

import { FileFactoryService } from './file-factory.user-case.service';
import { FileUseCase } from './file.use-case';
import { FileUseCaseEvent } from './file.use-case.event';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [FileFactoryService, FileUseCase, FileUseCaseEvent, R2FileService],
  exports: [FileFactoryService, FileUseCase],
})
export class FileUseCaseModule {}
