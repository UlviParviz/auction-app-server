import { Router } from 'express';
import { adminController } from '../controllers/AdminController';
import { authMiddleware } from '../middlewares/AuthMiddleware'; 

const router = Router();

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictToAdmin);

router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.delete('/auctions/:id', adminController.deleteAuction);

export default router;