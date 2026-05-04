import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { LoginSchema, RegisterSchema } from '../dtos/AuthDTO';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { validateMiddleware } from '../middlewares/ValidateMiddleware';

const router = Router();
const authController = new AuthController();

router.post('/register', validateMiddleware.validate(RegisterSchema), authController.register);;
router.post('/login', validateMiddleware.validate(LoginSchema), authController.login);
router.get('/me', authMiddleware.protect, authController.getMe);

export default router;