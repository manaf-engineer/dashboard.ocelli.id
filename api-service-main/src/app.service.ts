import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return { code: 200, message: 'Welcome to the Insect Trap', data: null };
  }
}
