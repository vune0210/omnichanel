import { join } from 'path';

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceName } from '@zma-nestjs-omnichannel/zma-types';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_SERVICE_GRPC',
        transport: Transport.GRPC,
        options: {
          package: ServiceName.CLIENT,
          protoPath: join(process.cwd(), 'libs/zma-grpc/src/proto/client.proto'),
          url: process.env.NX_GRPC_URL,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientModule {}
