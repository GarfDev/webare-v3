import * as http from 'http';
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

let io: Server | null = null;

export const createSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });
  return io;
};

export const getSocket = (): Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap
> => io as Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
