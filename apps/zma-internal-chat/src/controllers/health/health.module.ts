import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '@zma-nestjs-omnichannel/zma-config';

@Module({
  imports: [
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 9000,
      errorLogStyle: 'pretty',
    }),
    MongooseModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
