import { autoBind } from '../utils.js';
import * as Logger from '../logger.js';
import { AccountController } from '../controllers/account.js';

export class AccountMiddleware {
  constructor() {
    autoBind(this);
    this.logger = Logger.getInstance();
    this.controller = new AccountController();
  }

  async getProfile(req, res, next) {
    const userIdHeader = req.myStock.user.userId;
    const user = await this.controller.getProfile(userIdHeader);
    if (user) {
      res.json(user);
    } else {
      res.sendStatus(400);
    }
    next();
  }

  async updateProfile(req, res, next) {
    const userIdHeader = req.myStock.user.userId;
    const before = await this.controller.getProfile(userIdHeader);
    const after = req.body;
    // TODO: input verification
    const result = await this.controller.updateProfile(before, after);
    if (result.success) {
      this.logger.info('User profile updated successfully', userIdHeader);
      res.json({ token: result.token });
    } else {
      this.logger.info('Failed to update user profile', userIdHeader, result.error, before, after);
      res.sendStatus(500);
      return;
    }
    next();
  }
}
