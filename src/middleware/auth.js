import { autoBind } from '../utils.js';
import Logger from '@bidask/logger';
import { AuthController } from '../controllers/auth.js';

export class AuthMiddleware {
  constructor() {
    autoBind(this);
    this.logger = new Logger({ name: this.constructor.name });
    this.controller = new AuthController();
  }

  async register(req, res, next) {
    const { email, password } = req.body;
    const newUser = {
      email,
      password,
    };
    
    const createdUser = await this.controller.createUser(newUser);
    if (createdUser) {
      this.logger.info('User created successfully', createdUser);
      res.json(createdUser);
    } else {
      this.logger.info('Failed to create user', createdUser);
      res.sendStatus(400);
    }
    next();
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = {
      email,
      password,
    };

    const result = await this.controller.verifyUser(user);
    if (result?.hasCorrectPassword) {
      user.userId = result.userId;
      const token = this.controller.signToken(user);
      this.logger.info('User login succeeded', user);
      res.json({ token });
    } else {
      this.logger.info('User login failed', user);
      res.sendStatus(403);
    }
    next();
  }

  decodeToken(req, res, next) {
    const bearerHeader = req?.headers?.authorization;
    // Format: Bearer <token>
    const bearerToken = bearerHeader?.split(' ')?.[1];
    const result = this.controller.decodeToken(bearerToken);
    if (result?.hasValidToken) {
      const { user } = result;
      req.myStock = {};
      // Attach user info to the request
      req.myStock.user = user;
    } else {
      res.sendStatus(403);
      return;
    }
    next();
  }

  hasPermission(req, res, next) {
    const userIdHeader = req.get('userId');
    const userIdToken = req?.myStock?.user?.userId;
    // TODO: Users should have different permissions based on their roles
    if (userIdHeader !== userIdToken) {
      // Only allow to get profile on self
      res.sendStatus(403);
      return;
    }
    next();
  }
}

