import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('instagram')
export class InstagramWebhookController {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Instagram webhook verification endpoint
   * Called by Instagram (GET) to verify your webhook URL
   * Example: /instagram/webhook?hub.mode=subscribe&hub.verify_token=xxx&hub.challenge=yyy
   */
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    const VERIFY_TOKEN = this.configService.get<string>('NX_INSTAGRAM_VERIFY_TOKEN');
    //console.log('[Webhook Verify]', { mode, token, challenge });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Instagram webhook verified');
      return challenge;
    }

    console.warn('❌ Instagram webhook verification failed');
    return 'Verification failed';
  }
}
