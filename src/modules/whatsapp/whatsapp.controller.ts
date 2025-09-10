import { Controller, Get, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('/status')
  getStatus() {
    return {
      connected: this.whatsappService.getConnectionStatus(),
      timestamp: new Date().toTimeString,
    };
  }

  @Post('/sendMessage')
  async sendMessage(
    @Body() body: { phone: string; message: string },
  ): Promise<{ success: boolean; message: string }> {
    try {
      const myNumber = process.env.MY_NUMBER;

      const jid = body.phone.includes('@')
        ? body.phone
        : `${myNumber}@s.whatsapp.net`;

      await this.whatsappService.sendMessage(jid, body.message);
      return {
        success: true,
        message: 'message sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
