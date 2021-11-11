import axios from 'axios';
import { Config } from '../../configs';

export interface MessagePayload {
  text?: string;
  attachment?: {
    type: 'template';
    payload: {
      template_type: 'generic';
      elements: Array<{
        title: string;
        subtitle?: string;
        image_url?: string;
        default_action?: {
          type: string;
          url: string;
          webview_height_ratio: string;
        };
        buttons: Array<{
          type: 'postback',
          title: string;
          payload: string;
        }>
      }>;
    };
  };
}

export interface RequestPayload {
  messaging_type: 'RESPONSE';
  message: MessagePayload;
  recipient: {
    id: string;
  };
}

export const sendMessage = async (message: RequestPayload) => {
  const { PAGE_ACCESS_TOKEN } = Config;
  console.log('????????');
  const response = await axios({
    method: 'POST',
    url: `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
    data: message,
  });

  console.log('Sended message', response.data);
};
