import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { GqlAuthGuard } from './gql.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('NX_JWT_SECRET'),
        signOptions: { expiresIn: configService.get('NX_JWT_EXPIRATION_TIME') },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
    JwtStrategy,
  ],
})
export class GuardModule {}
