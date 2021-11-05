import React from 'react';
import { RecoilRoot } from 'recoil';
import { io } from 'socket.io-client';
import { SocketProvider } from './core/context/SocketProvider';
import { ChatPanel } from './core/components/ChatPanel';
import { getUniqueId } from './core/utils/getUniqueId';

const App = (): JSX.Element => {
  const socket = io('http://localhost:5000');
  socket.connect();

  React.useEffect(() => {

    socket.on('connect', () => {
      socket.emit('HANDSHAKE', {
        client_id: getUniqueId()
       })
     })

    socket.connect();
  }, [ socket ]);


  // main return
  return (
    <RecoilRoot>
      <SocketProvider value={socket}>
        <ChatPanel />
      </SocketProvider>
    </RecoilRoot>
  );
};

export default App;
