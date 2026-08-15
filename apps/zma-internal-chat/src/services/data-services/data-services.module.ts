import { Module } from '@nestjs/common';

import { MongoDataServicesModule } from '../../frameworks/data-services/mongo/mongo-data-services.module';
import { ScyllaDataServicesModule } from '../../frameworks/data-services/scylla/scylla-data-services.module';

@Module({
  imports: [MongoDataServicesModule, ScyllaDataServicesModule],
  exports: [MongoDataServicesModule, ScyllaDataServicesModule],
})
export class DataServicesModule {}
