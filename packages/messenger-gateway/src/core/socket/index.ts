import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

export const createSocketClient = () => {
  socket = io(process.env.MAIN_NODE_URL as string);
  return socket;
};

export const getSocket = (): Socket<DefaultEventsMap, DefaultEventsMap> =>
  socket as Socket<DefaultEventsMap, DefaultEventsMap>;
