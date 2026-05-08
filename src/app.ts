import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import auctionRoutes from './routes/AuctionRoutes';
import authRoutes from './routes/AuthRoutes';
import adminRoutes from './routes/AdminRoutes';
import notificationRoutes from './routes/NotificationRoutes'
import { AppError } from './utils/AppError';
import { errorMiddleware } from './middlewares/ErrorMiddleware';

dotenv.config();
export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors({
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }));
  }

  private initializeRoutes(): void {
    const apiPrefix = process.env.API_PREFIX || '/api';
    this.app.use(`${apiPrefix}/auctions`, auctionRoutes);
    this.app.use(`${apiPrefix}/auth`, authRoutes);
    this.app.use(`${apiPrefix}/admin`, adminRoutes)
    this.app.use(`${apiPrefix}/notifications`, notificationRoutes)
  }
  private initializeErrorHandling(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new AppError(`Bu marşrut (${req.originalUrl}) serverdə tapılmadı!`, 404));
    });

    this.app.use(errorMiddleware.globalErrorHandler);
  }

  public listen(port: number | string): void {
    const server = this.app.listen(port, () => {
      console.log(`🚀 Server ${port}-cu portda uğurla işə düşdü...`);
    });

    process.on('unhandledRejection', (err: Error) => {
      console.error('💥 UNHANDLED REJECTION! Server dayandırılır...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  }
}