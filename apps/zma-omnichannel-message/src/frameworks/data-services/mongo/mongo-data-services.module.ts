import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IDataServices } from '../../../core';

import { ClientEntity, ClientSchema } from './entities';
import { MongoDataServices } from './mongo-data-services.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ClientEntity.name, schema: ClientSchema }])],
  providers: [
    {
      provide: IDataServices,
      useClass: MongoDataServices,
    },
  ],
  exports: [IDataServices],
})
export class MongoDataServicesModule {}