import axios from 'axios';
import { getSocket } from 'core/socket';
import { Request, Response } from 'express';
import { EventType } from 'core/constants';
import { getUniqueId } from 'core/utils';
import { MessagePayload } from 'core/types';
import { getTemplate, noMatchedYetTemplate } from '../../templates';
import { sendMessage } from './sendMessage';

export const onNewMessage = (req: Request, res: Response) => {
  try {
    const socket = getSocket();
    const payload: MessagePayload = req.body;

    if (payload.object !== 'page') return;

    payload.entry.forEach(async (entry) => {
      const messageEvent = entry.messaging[0];
      const uuid = messageEvent.sender.id;

      if (messageEvent.message) {
        const message = {
          meta: { client_id: await getUniqueId() },
          author: { platform: 'messenger', uuid },
          content: {
            text: messageEvent.message.text,
          },
        }

        message.content['attachment'] = messageEvent.message.attachments?.[0] && {
          type: messageEvent.message.attachments[0].type,
          payload: {
            url: messageEvent.message.attachments[0].payload.url
          }
        }
        socket.emit(EventType.MESSAGE, message);
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
          case 'TOGGLE_ATTACHMENT': {
            try {
              const res = await axios.post(
                `${process.env.MAIN_NODE_URL}/match/attachment`,
                {
                  author: { platform: 'messenger', id: messageEvent.sender.id },
                }
              );
              sendMessage({
                messaging_type: 'RESPONSE',
                recipient: {
                  id: messageEvent.sender.id,
                },
                message: getTemplate(res.data.message),
              });
            } catch {}
            break;
          }
          case 'LEAVE_QUEUE': {
            try {
              const res = await axios.post(
                `${process.env.MAIN_NODE_URL}/queue/leave`,
                {
                  author: { platform: 'messenger', id: messageEvent.sender.id },
                }
              );
              sendMessage({
                messaging_type: 'RESPONSE',
                recipient: {
                  id: messageEvent.sender.id,
                },
                message: getTemplate(res.data.message),
              });
            } catch {}
            break;
          }
          case 'FIND_MATCH': {
            try {
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
                message: getTemplate(res.data.message),
              });
            } catch {}
            break;
          }
          case 'END_MATCH': {
            try {
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
                message: getTemplate(res.data.message),
              });
            } catch {}
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
