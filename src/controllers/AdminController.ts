import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';
import { AsyncWrapper } from '../utils/CatchAsync';

export class AdminController {
  private adminService = new AdminService();

  public getAllUsers = AsyncWrapper.catch(async (req: Request, res: Response) => {
    const users = await this.adminService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  });

  public deleteUser = AsyncWrapper.catch(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    await this.adminService.deleteUser(id);
    res.status(200).json({ success: true, message: 'İstifadəçi uğurla silindi' });
  });

  public deleteAuction = AsyncWrapper.catch(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    await this.adminService.deleteAuction(id);
    res.status(200).json({ success: true, message: 'Hərrac sistemdən tamamilə silindi' });
  });
}

export const adminController = new AdminController();