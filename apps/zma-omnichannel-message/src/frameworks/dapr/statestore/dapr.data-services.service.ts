// import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
// import { DaprClient } from '@dapr/dapr';
// import { IDataServices } from '../../../core';
// import { ITenantGenericRepository, DaprTenantMongoGenericRepository } from '@zma-nestjs-omnichannel/zma-repositories';
// import { ClientEntity } from '../statestore/mongo/enitties';

// @Injectable()
// export class DaprDataServices implements IDataServices, OnApplicationBootstrap {
//   clientService?: ITenantGenericRepository<ClientEntity>;

//   constructor(private readonly daprClient: DaprClient) {}

//   onApplicationBootstrap() {
//     this.clientService = new DaprTenantMongoGenericRepository(
//       this.daprClient,
//       process.env.NX_DAPR_MONGO_CLIENT_STORE || 'mongo-client-store'
//     );
//   }
// }
