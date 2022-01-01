import * as Logger from '../logger.js';
import * as DatabaseClient from '../clients/DatabaseClient.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SECRET_KEY } from '../constants.js';
import Chance from 'chance';

export class AuthController {
  constructor() {
    this.logger = Logger.getInstance();
    this.dbClient = DatabaseClient.getInstance();
  }

  _generateUserId() {
    const chance = new Chance();
    const config = { length: 8, alpha: true, numeric: true };
    return chance.string(config);
  }

  validateUser(user) {
    if (!user.email || !user.password) return false;
    return true;
  }
  
  async createUser(user) {
    if (!this.validateUser(user)) return null;
    const { email, password } = user;

    // Check if the email has already been registered
    const users = await this.dbClient.find('users', { email });
    if (users.length !== 0) return null;

    user.userId = this._generateUserId();
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      user.password = hash;
      this.dbClient.insert('users', user);
    });
    return user;
  }
  
  async verifyUser(userSubmitted) {
    const { email, password: passwordSubmitted } = userSubmitted;
    const users = await this.dbClient.find('users', { email });
    if (users?.length !== 1) return { hasCorrectPassword: false };
    
    const { userId, password: passwordStored } = users[0];
    try {
      const match = await bcrypt.compare(passwordSubmitted, passwordStored);
      if (!match) {  
        this.logger.info('Password comparison failed', passwordSubmitted, passwordStored);
        return { hasCorrectPassword: false };
      }
      return {
        hasCorrectPassword: true,
        userId,
      };
    } catch(err) {
      this.logger.error('Error occurred while performing password comparison', passwordSubmitted, passwordStored, err);
      return {
        hasCorrectPassword: false,
        error: err,
      };
    }
  }

  signToken(user) {
    user.password = undefined;
    const token = jwt.sign(user, SECRET_KEY);
    return token;
  }
  
  decodeToken(bearerToken) {
    let decoded;
    try {
      decoded = jwt.verify(bearerToken, SECRET_KEY);
    } catch(err) {
      if (err instanceof jwt.JsonWebTokenError) {
        this.logger.info('Failed to decode the JWT token: invalid token');
      } else if (err instanceof jwt.TokenExpiredError) {
        this.logger.info('Failed to decode the JWT token: expired token');
      } else {
        this.logger.info('Failed to decode the JWT token:', err);
      }
      return {
        hasValidToken: false,
        error: err,
      };
    }
    this.logger.info('JWT token decoded successfully', decoded);
    return {
      hasValidToken: true,
      user: decoded,
    };
  }
}