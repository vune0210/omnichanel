import { Injectable } from '@nestjs/common';

import { PlatformEnum } from '../../../core/types';
import { MessageUseCaseFacebook } from '../implements/facebook/message.use-case.facebook';
import { MessageUseCaseZalo } from '../implements/zalo/message.use-case.zalo';
import { IMessageInterface } from '../interfaces/message.use-case.interface';
import { MessageUseCaseInstagram } from '../implements/instagram/message.use-case.instagram';
import { MessageUseCaseWhatsApp } from '../implements/whatsapp/message.use-case.whatsapp';


@Injectable()
export class MessageUseCaseFactory {
  constructor(
    private facebook: MessageUseCaseFacebook,
    private zalo: MessageUseCaseZalo,
    private instagram: MessageUseCaseInstagram,
    private whatsapp: MessageUseCaseWhatsApp,
  ) {}

  get(platform: PlatformEnum): IMessageInterface {
    switch (platform) {
      case PlatformEnum.Facebook:
        return this.facebook;
      case PlatformEnum.Zalo:
        return this.zalo;
      case PlatformEnum.Instagram:
        return this.instagram;
      case PlatformEnum.WhatsApp:
        return this.whatsapp;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}
