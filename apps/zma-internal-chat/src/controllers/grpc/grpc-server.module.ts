import { Module } from "@nestjs/common";

//import { ClientUseCaseModule } from "../../use-cases/client/client.use-case.module";

import { ClientGrpcController } from ".";

@Module({
  //imports: [ClientUseCaseModule],
  controllers: [ClientGrpcController],
})
export class GrpcServerModule {}
