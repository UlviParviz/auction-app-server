import http from 'http';
import dotenv from 'dotenv';
import { App } from './app';
import { SocketManager } from './sockets/SocketManager';
import { JobManager } from './jobs/JobManager';

dotenv.config();

export class Server {
  private server: http.Server;
  private port: number | string;

  constructor() {
    this.port = process.env.PORT || 3000;
    
    const appInstance = new App().app;
    
    this.server = http.createServer(appInstance);
  }

  public start(): void {
    this.handleUncaughtExceptions();

    SocketManager.init(this.server);

    JobManager.startAll();

    this.server.listen(this.port, () => {
      console.log(`🚀 Server və Socket.io ${this.port}-cu portda işə düşdü...`);
    });

    this.handleUnhandledRejections();

    this.handleGracefulShutdown();
  }

  private handleUncaughtExceptions(): void {
    process.on('uncaughtException', (err: Error) => {
      console.error('💥 UNCAUGHT EXCEPTION! Server dərhal dayandırılır...');
      console.error(err.name, err.message, err.stack);
      process.exit(1);
    });
  }

  private handleUnhandledRejections(): void {
    process.on('unhandledRejection', (err: Error) => {
      console.error('💥 UNHANDLED REJECTION! Server təhlükəsiz şəkildə dayandırılır...');
      console.error(err.name, err.message);
      
      this.server.close(() => {
        process.exit(1);
      });
    });
  }

  private handleGracefulShutdown(): void {
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM siqnalı alındı. Server nəzakətlə söndürülür...');
      this.server.close(() => {
        console.log('💤 Bütün əməliyyatlar dayandırıldı.');
      });
    });
  }
}

const appServer = new Server();
appServer.start();