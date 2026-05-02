import http from 'http';
import { App } from './app';
import { SocketManager } from './sockets/SocketManager';
import dotenv from 'dotenv';

dotenv.config();

const appInstance = new App().app;

const server = http.createServer(appInstance);

SocketManager.init(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server və Socket.io ${PORT}-cu portda işə düşdü...`);
});