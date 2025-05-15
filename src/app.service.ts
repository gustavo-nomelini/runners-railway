import { Injectable } from '@nestjs/common';

// This is a simple service that returns a greeting message
// PLACEHOLDER: This is a placeholder service that can be replaced with actual business logic
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
