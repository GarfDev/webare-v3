import React from 'react';
import { useRecoilState } from 'recoil';
import { messageAtom } from '../../atoms/messages';
import { useSocket } from '../../context/SocketProvider';
import { getUniqueId } from '../../utils/getUniqueId';

export const ChatPanel = (): JSX.Element => {
  const socket = useSocket();
  const uuid = getUniqueId();
  const [content, setContent] = React.useState('');
  const [messages, setMessages] = useRecoilState(messageAtom);

  const onNewMessage = React.useRef((newMessage: any) => {
    setMessages((pre) => [...pre, newMessage.content.text]);
  })

  React.useEffect(() => {
    onNewMessage.current = (newMessage: any) => {
      setMessages((pre) => [...pre, newMessage.content.text]);
    }
  },
    [messages, setMessages]
  );

  React.useEffect(() => {
    socket.on('RECEIVE_MESSAGE', onNewMessage.current);
    return () => {
      socket.removeListener('RECEIVE_MESSAGE');
    };
  }, [socket]);

  const onClick = () => {
    socket.emit('MESSAGE', {
      meta: { client_id: getUniqueId() },
      author: { platform: 'web', uuid },
      content: { text: content },
    });
  };

  // main return
  return (
    <div>
      {messages.map((item, i) => (
        <p key={item + i}>{item}</p>
      ))}
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
      ></textarea>
      <button onClick={onClick}>Send</button>
    </div>
  );
};
