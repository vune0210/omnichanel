// import { Module } from '@nestjs/common';

// import { DaprStateStoreModule } from '../../frameworks/dapr/statestore/dapr.statestore.module';
// import { ScyllaDataServicesModule } from '../../frameworks/data-services/scylla/scylla-data-services.module';

// @Module({
//   imports: [DaprStateStoreModule, ScyllaDataServicesModule],
//   exports: [DaprStateStoreModule, ScyllaDataServicesModule],
// })
// export class DataServicesModule {}
import { Module } from '@nestjs/common';

import { MongoDataServicesModule } from '../../frameworks/data-services/mongo/mongo-data-services.module';
import { ScyllaDataServicesModule } from '../../frameworks/data-services/scylla/scylla-data-services.module';

@Module({
  imports: [MongoDataServicesModule, ScyllaDataServicesModule],
  exports: [MongoDataServicesModule, ScyllaDataServicesModule],
})
export class DataServicesModule {}