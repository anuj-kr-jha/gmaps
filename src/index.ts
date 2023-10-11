import 'dotenv/config.js';
import server from './config/http.js';
import socket from './config/socket.js';
import './config/mongo.js';

server.initialize();
socket.initialize(server.httpServer);
