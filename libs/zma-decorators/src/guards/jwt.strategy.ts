/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticatedUser } from '@zma-nestjs-omnichannel/zma-types/outputs/user';
import * as _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('NX_JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('NX_JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    const authenticatedUser = _.merge(payload, {}) as AuthenticatedUser;
    return authenticatedUser;
  }
}
