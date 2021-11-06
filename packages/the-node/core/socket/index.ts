import * as http from 'http';
import { Server } from 'socket.io';

let io: Server = null;

export const createSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });
  return io;
};

export const getSocket = () => io;
