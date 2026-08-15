import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { DaprProducerService } from './dapr.producer.service';


@Module({
  imports: [HttpModule],
  providers: [DaprProducerService],
  exports: [DaprProducerService],
})
export class DaprProducerModule {}
