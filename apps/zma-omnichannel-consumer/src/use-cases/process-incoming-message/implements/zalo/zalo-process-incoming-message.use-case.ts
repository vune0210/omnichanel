import { Injectable } from '@nestjs/common';

import { KafkaProducerService } from '../../../../framework/kafka/kafka.producer.service';
import { ProcessIncomingMessageUseCase } from '../../interfaces/process-incoming-message.use-case.interface';

@Injectable()
export class ZaloProcessIncomingMessageUseCase implements ProcessIncomingMessageUseCase {
  constructor(
    //private readonly redisService: RedisService,
    //private readonly kafkaProducer: KafkaProducerService,
    
  ) {console.log("Hello world");}

  async execute(body: any): Promise<void> {
    console.log('Hello world');
  }
}
