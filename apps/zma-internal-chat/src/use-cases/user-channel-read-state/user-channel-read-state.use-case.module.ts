import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { DataServicesModule } from '../../services/data-services/data-services.module';
import { UserChannelReadStateFactoryService } from './user-channel-read-state-factory.user-case.service';
import { UserChannelReadStateUseCase } from './user-channel-read-state.use-case';

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
  providers: [UserChannelReadStateFactoryService, UserChannelReadStateUseCase],
  exports: [UserChannelReadStateFactoryService, UserChannelReadStateUseCase],
})
export class UserChannelReadStateUseCaseModule {}
