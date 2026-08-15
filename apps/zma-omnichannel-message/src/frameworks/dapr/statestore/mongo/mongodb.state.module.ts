// import { Module } from '@nestjs/common';
// import { DaprClient } from '@dapr/dapr';
// import { ITenantGenericRepository, DaprTenantMongoGenericRepository } from '@zma-nestjs-omnichannel/zma-repositories';
// import { createDaprClient } from '../common/dapr.client';
// import { ClientEntity } from './enitties';

// @Module({
//   providers: [
//     {
//       provide: DaprClient,
//       useFactory: createDaprClient,
//     },
//     {
//       provide: 'DAPR_CLIENT_REPO',
//       useFactory: (daprClient: DaprClient): ITenantGenericRepository<ClientEntity> => {
//         return new DaprTenantMongoGenericRepository(
//           daprClient,
//           process.env.DAPR_MONGO_CLIENT_STORE || 'mongo-client-store'
//         );
//       },
//       inject: [DaprClient],
//     },
//   ],
//   exports: ['DAPR_CLIENT_REPO', DaprClient],
// })
// export class MongoStateModule {}
