import * as Logger from '../logger.js';
import * as DatabaseClient from '../clients/DatabaseClient.js';
import { AuthController } from './auth.js';

export class AccountController {
  constructor() {
    this.logger = Logger.getInstance();
    this.dbClient = DatabaseClient.getInstance();
  }

  async getProfile(userId) {
    const users = await this.dbClient.find('users', { userId });
    if (users?.length === 1) {
      const user = users[0];
      // TODO: Filter out the fields depending on user roles
      const hiddenFields = ['_id', 'password'];
      for (const field of hiddenFields) user[field] = undefined;
      this.logger.info('User profile fetched successfully', userId);
      return user;
    }
    this.logger.error('Failed to fetch user profile, duplicate userId found', userId);
    return undefined;
  }
  
  _isLegalToUpdate(before, after) {
    if (after._id) return false;
    if (before.userId !== after?.userId) return false;
    if (before.email !== after?.email) return false;
    return true;
  }

  async updateProfile(before, after) {
    if (!this._isLegalToUpdate(before, after)) {
      return {
        success: false,
        error: 'the profile update is illegal',
      };
    }
    const { result } = await this.dbClient.updateOne('users', { userId: before.userId }, after);
    const authController = new AuthController();
    const token = authController.signToken(after);
    return {
      success: true,
      updated: after,
      token,
      stats: result,
    };
  }
}