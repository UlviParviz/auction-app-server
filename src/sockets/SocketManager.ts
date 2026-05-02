import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

export class SocketManager {
  private static instance: SocketManager;
  public io: SocketIOServer;

  private constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*", 
        methods: ["GET", "POST"]
      }
    });
    this.setupListeners();
  }

  public static init(server: HttpServer): SocketManager {
    if (!this.instance) {
      this.instance = new SocketManager(server);
    }
    return this.instance;
  }

  public static getInstance(): SocketManager {
    if (!this.instance) {
      throw new Error("SocketManager hələ inisializasiya olunmayıb!");
    }
    return this.instance;
  }

  private setupListeners(): void {
    this.io.on('connection', (socket) => {
      console.log(`Yeni istifadəçi qoşuldu: ${socket.id}`);

      socket.on('joinAuction', (auctionId: number) => {
        socket.join(`auction_${auctionId}`);
        console.log(`İstifadəçi ${socket.id} hərraca qoşuldu: auction_${auctionId}`);
      });

      socket.on('disconnect', () => {
        console.log(`İstifadəçi ayrıldı: ${socket.id}`);
      });
    });
  }
}