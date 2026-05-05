import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { validateMiddleware } from '../middlewares/ValidateMiddleware';
import { AuthDTO } from '../dtos/AuthDTO';

const router = Router();
const authController = new AuthController();

router.post('/register', validateMiddleware.validate(AuthDTO.RegisterSchema), authController.register);;
router.post('/login', validateMiddleware.validate(AuthDTO.LoginSchema), authController.login);
router.get('/me', authMiddleware.protect, authController.getMe);
router.put('/update-password', authMiddleware.protect, authController.updatePassword);

export default router;