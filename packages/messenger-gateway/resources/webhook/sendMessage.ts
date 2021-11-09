import axios from 'axios';
import { Config } from '../../Config';

interface MessagePayload {
  text: string;
}

export interface RequestPayload {
  messaging_type: 'RESPONSE',
  message: MessagePayload;
  recipient: {
    id: string;
  };
}

export const sendMessage = async (message: RequestPayload) => {
  const { PAGE_ACCESS_TOKEN } = Config;
  console.log("????????")
  const response = await axios({
    method: 'POST',
    url: `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
    data: message,
  });

  console.log('Sended message', response.data);
};
