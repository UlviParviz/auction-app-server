import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

export class SocketManager {
  private static instance: SocketManager;
  public io: SocketIOServer;

  private constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173", 
        methods: ["GET", "POST"],
        credentials: true
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
    this.io.on('connection', (socket: Socket) => {
      console.log(`🟢 Yeni istifadəçi qoşuldu: ${socket.id}`);

      socket.on('joinAuction', (auctionId: number) => {
        if (!auctionId) return;
        
        const roomName = `auction_${auctionId}`;
        socket.join(roomName);
        console.log(`👤 İstifadəçi ${socket.id} qoşuldu: ${roomName}`);
      });

      socket.on('leaveAuction', (auctionId: number) => {
        if (!auctionId) return;

        const roomName = `auction_${auctionId}`;
        socket.leave(roomName);
        console.log(`👋 İstifadəçi ${socket.id} ayrıldı: ${roomName}`);
      });

      socket.on('authenticateUser', (userId: number) => {
        if (!userId) return;
        const personalRoom = `user_${userId}`;
        socket.join(personalRoom);
        console.log(`🔐 İstifadəçi ${socket.id} şəxsi otağına qoşuldu: ${personalRoom}`);
      });

      socket.on('logoutUser', (userId: number) => {
        if (!userId) return;
        socket.leave(`user_${userId}`);
      });

      socket.on('disconnect', () => {
        console.log(`🔴 İstifadəçi ayrıldı: ${socket.id}`);
      });
    });
  }
}