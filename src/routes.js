import { Router } from 'express';
import { AuthMiddleware } from './middleware/auth.js';
import { AccountMiddleware } from './middleware/account.js';
import { ErrorMiddleware } from './middleware/error.js';

const router = Router();
const authMiddleware = new AuthMiddleware();
const accountMiddleware = new AccountMiddleware();
const errorMiddleware = new ErrorMiddleware();

router.post('/api/register', authMiddleware.register);
router.post('/api/login', authMiddleware.login);
router.get('/api/account', [
  authMiddleware.decodeToken,
  authMiddleware.hasPermission,
  accountMiddleware.getProfile
]);
router.post('/api/account', [
  authMiddleware.decodeToken,
  authMiddleware.hasPermission,
  accountMiddleware.updateProfile
]);
router.use(errorMiddleware.handle);

export default router;