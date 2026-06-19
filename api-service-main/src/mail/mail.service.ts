import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail-queue') private readonly mailQueue: Queue) {}

  async forgetPassword(data: Record<string, any>): Promise<void> {
    try {
      await this.mailQueue.add('reset-password', data);
      Logger.log('Forget password email added to queue');
    } catch (error) {
      Logger.error(error.message);
    }
  }
}
