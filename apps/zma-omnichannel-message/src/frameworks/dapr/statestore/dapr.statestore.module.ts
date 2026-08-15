// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { IDataServices } from '../../../core';
// import { DaprClient } from '@dapr/dapr';
// import { createDaprClient } from './common/dapr.client';
// import { DaprDataServices } from './dapr.data-services.service';

// @Module({
//   imports: [ConfigModule],
//   providers: [
//     {
//       provide: DaprClient,
//       useFactory: createDaprClient,
//     },
//     {
//       provide: IDataServices,
//       useClass: DaprDataServices,
//     },
//   ],
//   exports: [IDataServices],
// })
// export class DaprStateStoreModule {}
