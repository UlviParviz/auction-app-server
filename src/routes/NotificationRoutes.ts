import { Router } from 'express';
import { notificationController } from '../controllers/NotificationController';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();

router.use(authMiddleware.protect);

router.get('/', notificationController.getMyNotifications);

router.put('/mark-all-read', notificationController.markAllAsRead);

router.put('/:id/read', notificationController.markAsRead);

export default router;