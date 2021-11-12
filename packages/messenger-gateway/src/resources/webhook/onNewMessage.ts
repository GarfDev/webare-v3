import axios from 'axios';
import { getSocket } from 'core/socket';
import { Request, Response } from 'express';
import { getI18n } from 'core/i18n';
import { EventType } from 'core/constants';
import { getUniqueId } from 'core/utils';
import { MessagePayload } from 'core/types';
import { noMatchedYetTemplate } from '../../templates';
import { sendMessage } from './sendMessage';

export const onNewMessage = (req: Request, res: Response) => {
  try {
    const i18n = getI18n();
    const socket = getSocket();
    const payload: MessagePayload = req.body;

    if (payload.object !== 'page') return;

    payload.entry.forEach(async (entry) => {
      const messageEvent = entry.messaging[0];
      const uuid = messageEvent.sender.id;

      console.log(messageEvent);

      if (messageEvent.message) {
        socket.emit(EventType.MESSAGE, {
          meta: { client_id: await getUniqueId() },
          author: { platform: 'messenger', uuid },
          content: { text: messageEvent.message.text },
        });
      } else if (messageEvent.postback) {
        const postback = messageEvent.postback;
        switch (postback.payload) {
          case 'START_MATCH': {
            try {
              await sendMessage({
                messaging_type: 'RESPONSE',
                recipient: {
                  id: messageEvent.sender.id,
                },
                message: noMatchedYetTemplate,
              });
            } catch (e) {}
            break;
          }
          case 'FIND_MATCH': {
            const res = await axios.post(
              `${process.env.MAIN_NODE_URL}/queue/join`,
              {
                author: { platform: 'messenger', id: messageEvent.sender.id },
              }
            );
            sendMessage({
              messaging_type: 'RESPONSE',
              recipient: {
                id: messageEvent.sender.id,
              },
              message: {
                text: res.data.message,
              },
            });
            break;
          }
          case 'END_MATCH': {
            const res = await axios.post(
              `${process.env.MAIN_NODE_URL}/match/leave`,
              {
                author: { platform: 'messenger', id: messageEvent.sender.id },
              }
            );
            sendMessage({
              messaging_type: 'RESPONSE',
              recipient: {
                id: messageEvent.sender.id,
              },
              message: {
                text: res.data.message,
              },
            });
            break;
          }
        }
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } catch {
    res.sendStatus(500);
  }
};
