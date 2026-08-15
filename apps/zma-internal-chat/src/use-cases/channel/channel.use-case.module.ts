import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { DataServicesModule } from '../../services/data-services/data-services.module';
import { ChannelFactoryService } from './channel-factory.user-case.service';
import { ChannelUseCase } from './channel.use-case';

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
  providers: [ChannelFactoryService, ChannelUseCase],
  exports: [ChannelFactoryService, ChannelUseCase],
})
export class ChannelUseCaseModule {}
