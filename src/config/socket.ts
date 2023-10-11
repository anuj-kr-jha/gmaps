/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import SocketRouter from './router.socket.js';
import helper from '../common/utils/helper.js';

const log = console;

class SocketIO {
  io!: Server;

  async initialize(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      pingInterval: 25000,
      pingTimeout: 20000,
      maxHttpBufferSize: 1e8,
      allowUpgrades: false,
      perMessageDeflate: false,
      serveClient: true,
      // adapter: ioredis.getAdapter(),
      cookie: false,
      transports: ['websocket'],
      path: '/socket.io/',
      connectTimeout: 45000,
      allowEIO3: false, // - default -> false. Whether to enable compatibility with Socket.IO v2 clients.
      // parser: require('socket.io-parser'),
      cors: {
        origin: '*:*',
        methods: ['GET', 'POST'],
        credentials: false,
      },
    });
    this.setEventListeners();
    log.info('SocketIO initialized');
  }

  async middleware(socket: Socket, next: any) {
    const encodedToken = socket.handshake.headers.authorization as string;
    if (!encodedToken) return next(new Error('Invalid "authorization" token in header'));
    const response = await helper.verifyToken(encodedToken);
    if (!response.status) return next(new Error('Invalid "authorization" token in header'));
    (<any>socket).user = response.payload;
    next();
  }

  setEventListeners() {
    this.io.use((socket, next) => this.middleware(socket, next));
    this.io.on('connection', socket => new SocketRouter(socket));
    this.io.on('error', log.error);
  }
}

const socket = new SocketIO();
export default socket;
