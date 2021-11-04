import React from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

type SocketContext = Socket<DefaultEventsMap, DefaultEventsMap>;

const Context = React.createContext<SocketContext>(null as unknown as SocketContext);

interface Props {
  value: SocketContext;
}

export const SocketProvider: React.FC<Props> = ({ children, value }) => {
  // main return
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useSocket = () => {
  return React.useContext(Context)
}
