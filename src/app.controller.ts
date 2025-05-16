import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ThrottlePublic } from './core/throttler/throttler.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ThrottlePublic()
  getHello(): string {
    return this.appService.getHello();
  }
}
