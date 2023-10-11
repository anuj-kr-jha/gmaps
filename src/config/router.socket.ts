/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import type { Socket } from 'socket.io';
import { getPlaceId, getDirection, getGeoCode } from '../events/getPlaceId.js';

type UserSocket = Socket & { user?: { userId: string; email: string } };

export default class SocketRouter {
  socket: UserSocket;

  userId: string;

  email: string;

  constructor(socket: UserSocket) {
    this.socket = socket;
    this.userId = socket.user?.userId!;
    this.email = socket.user?.email!;
    console.log(`client ${this.email} with socket id ${this.socket.id} connected`);
    this.addListeners();
  }

  addListeners() {
    this.socket.on('disconnect', () => this.disconnect());
    this.socket.on('getGeoCode', getGeoCode.bind(this as any));
    this.socket.on('getPlaceId', getPlaceId.bind(this as any));
    this.socket.on('getDirection', getDirection.bind(this as any));
  }

  disconnect() {
    console.log(`client ${this.email} with socket id ${this.socket.id} disconnected`);
  }
}
