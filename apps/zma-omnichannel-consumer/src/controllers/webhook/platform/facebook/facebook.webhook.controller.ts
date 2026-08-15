import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('facebook')
export class FacebookWebhookController {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Facebook webhook verification endpoint
   * Called by Facebook (GET) to verify your webhook URL
   * Example: /facebook/webhook?hub.mode=subscribe&hub.verify_token=xxx&hub.challenge=yyy
   */
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    const VERIFY_TOKEN = this.configService.get<string>('NX_FACEBOOK_VERIFY_TOKEN');
    //console.log('[Webhook Verify]', { mode, token, challenge });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Facebook webhook verified');
      return challenge;
    }

    console.warn('❌ Facebook webhook verification failed');
    return 'Verification failed';
  }
}
