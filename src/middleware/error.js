import { autoBind } from '../utils.js';
import Logger from '@bidask/logger';
import { ErrorController } from '../controllers/error.js';

export class ErrorMiddleware {
  constructor() {
    autoBind(this);
    this.logger = new Logger({ name: this.constructor.name });
    this.controller = new ErrorController();
  }

  handle(err, req, res, next) {
    console.log('here');
    this.logger.error('An error has occurred', err);
    res.status(500);
    next();
  }
}