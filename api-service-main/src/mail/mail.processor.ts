import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Processor('mail-queue')
export class MailProcessor {
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @OnQueueActive()
  onActive(job) {
    Logger.log(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job, result: any) {
    Logger.log(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job, error: any) {
    Logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('reset-password')
  async forgetPassword(data) {
    const { email, name, link } = data.data;

    await this.mailService.sendMail({
      subject: 'Reset Password',
      from: this.configService.get('smtpMailFrom'),
      to: email,
      html: `
                <!DOCTYPE html>
                <html>
                <body>
                    Halo ${name}. Berikut link konfirmasi email anda, link hanya berlu 15 menit.
                    <br><br>
                    <a href="${link}">Reset Password</a>
                </body>
                </html>
            `,
    });
  }
}
