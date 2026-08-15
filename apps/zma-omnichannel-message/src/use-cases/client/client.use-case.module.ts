import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { DataServicesModule } from '../../services/data-services/data-services.module';

import { MqttPublisherModule } from '../../frameworks/dapr/pubsub/mqtt/mqtt.publisher.module';
import { ClientFactoryService } from './client-factory.user-case.service';
import { ClientUseCase } from './client.use-case';

@Module({
  imports: [
    DataServicesModule,
    MqttPublisherModule,
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
  providers: [ClientFactoryService, ClientUseCase],
  exports: [ClientFactoryService, ClientUseCase],
})
export class ClientUseCaseModule {}
