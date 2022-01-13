import Logger from '@bidask/logger';

export class ErrorController {
  constructor() {
    this.logger = new Logger({ name: this.constructor.name });
  }
}