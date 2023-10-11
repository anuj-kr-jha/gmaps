import http, { Server as HttpServer } from 'node:http';
import express, { Express } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import router from './router.api.js';

const log = console;

class Server {
  public app!: Express;

  public httpServer!: HttpServer;

  async initialize() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.setupMiddleware();
    this.setupServer();
  }

  private setupMiddleware() {
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: '10Mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    this.app.use('/', router);
  }

  private setupServer() {
    this.httpServer.timeout = 10000;
    this.httpServer.listen(process.env.PORT, () => log.info(`Spinning on ${process.env.PORT} 🌀. [${process.env.NODE_ENV} pid_${process.pid} ppid_${process.ppid}]`));
  }
}

const server = new Server();
export default server;
