import { Module } from '@nestjs/common';
import { ScyllaDBConfigService } from '@zma-nestjs-omnichannel/zma-config';
import { Client as ScyllaClient } from 'cassandra-driver';

import { ScyllaInitService } from '../../../services/scylladb/scylla-init.service';

import { ScyllaMessageRepository } from './repositories/message.repository';
import { ScyllaDataServices } from './scylla-data-services.service';

@Module({
  providers: [
    ScyllaDBConfigService,
    {
      provide: ScyllaClient,
      useFactory: async (configService: ScyllaDBConfigService) => configService.getClient(),
      inject: [ScyllaDBConfigService],
    },
    ScyllaMessageRepository,
    {
      provide: 'IDataServices',
      useClass: ScyllaDataServices,
    },
    ScyllaInitService,
  ],
  exports: ['IDataServices'],
})
export class ScyllaDataServicesModule {}
