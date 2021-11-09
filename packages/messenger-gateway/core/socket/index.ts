import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

let socket: Socket<DefaultEventsMap, DefaultEventsMap> = null;

export const createSocketClient = () => {
  socket = io(process.env.MAIN_NODE_URL);
  return io;
};

export const getSocket = (): Socket<DefaultEventsMap, DefaultEventsMap> =>
  socket;
