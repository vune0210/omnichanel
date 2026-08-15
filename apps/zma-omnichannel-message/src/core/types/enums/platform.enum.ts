import { registerEnumType } from '@nestjs/graphql';

export enum PlatformEnum {
  Facebook = 'FACEBOOK',
  Zalo = 'ZALO',
  Instagram = 'INSTAGRAM',
  WhatsApp = 'WHATSAPP',
}

registerEnumType(PlatformEnum, {
  name: 'PlatformEnum',
});
