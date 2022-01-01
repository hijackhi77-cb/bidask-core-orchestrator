import { autoBind } from '../utils.js';
import { ErrorController } from '../controllers/error.js';
import * as Logger from '../logger.js';

export class ErrorMiddleware {
  constructor() {
    autoBind(this);
    this.logger = Logger.getInstance();
    this.controller = new ErrorController();
  }

  handle(err, req, res, next) {
    console.log('here');
    this.logger.error('An error has occurred', err);
    res.status(500);
    next();
  }
}