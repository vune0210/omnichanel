import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IDataServices } from '../../../core';

import { FileEntity, FileSchema } from './entities';
import { MongoDataServices } from './mongo-data-services.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: FileEntity.name, schema: FileSchema }])],
  providers: [
    {
      provide: IDataServices,
      useClass: MongoDataServices,
    },
  ],
  exports: [IDataServices],
})
export class MongoDataServicesModule {}
