import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import auctionRoutes from './routes/AuctionRoutes';

dotenv.config();

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json());
    
    this.app.use(cors({
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }));
  }

  private routes(): void {
    const apiPrefix = process.env.API_PREFIX || '/api';
    this.app.use(`${apiPrefix}/auctions`, auctionRoutes);
  }
}