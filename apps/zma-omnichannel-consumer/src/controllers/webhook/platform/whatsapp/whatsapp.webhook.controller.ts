import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('whatsapp')
export class WhatsappWebhookController {
  constructor(private readonly configService: ConfigService) {}

  /**
   * WhatsApp webhook verification endpoint
   * Called by WhatsApp (GET) to verify your webhook URL
   * Example: /whatsapp/webhook?hub.mode=subscribe&hub.verify_token=xxx&hub.challenge=yyy
   */
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    const VERIFY_TOKEN = this.configService.get<string>('NX_WHATSAPP_VERIFY_TOKEN');
    //console.log('[Webhook Verify]', { mode, token, challenge });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ WhatsApp webhook verified');
      return challenge;
    }

    console.warn('❌ WhatsApp webhook verification failed');
    return 'Verification failed';
  }
}
