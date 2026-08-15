import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { DataServicesModule } from '../../services/data-services/data-services.module';
import { MessageFactoryService } from './message-factory.user-case.service';
import { MessageUseCase } from './message.use-case';

@Module({
  imports: [
    DataServicesModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'TEST_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('URL'),
            port: 3001,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [MessageFactoryService, MessageUseCase],
  exports: [MessageFactoryService, MessageUseCase],
})
export class MessageUseCaseModule {}
