import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
  MicroserviceInput,
  ServiceName,
  ClientServiceSubject,
} from '@zma-nestjs-omnichannel/zma-types';
import {
  ClientServiceInputMapper,
  ClientServiceOutputMapper,
} from '@zma-nestjs-omnichannel/zma-types/mappers/client';

@Controller()
export class ClientGrpcController {
  // constructor(private readonly clientUseCase: ClientUseCase) {}

  // @GrpcMethod(ServiceName.CLIENT, ClientServiceSubject.CheckOrCreate)
  // async checkOrCreate(
  //   @Payload()
  //   input: MicroserviceInput<ClientServiceInputMapper<ClientServiceSubject.CheckOrCreate>>,
  // ): Promise<ClientServiceOutputMapper<ClientServiceSubject.CheckOrCreate>> {
  //   // Log payload gốc
  //   // console.log(`📩 gRPC raw input: ${JSON.stringify(input, null, 2)}`);

  //   const { platform, platformId } = input.data;

  //   const ok = await this.clientUseCase.checkOrCreateClient({ platformId, platform: platform as PlatformEnum });

  //   // Trả kết quả đúng mapper
  //   return { ok };
  // }
}
