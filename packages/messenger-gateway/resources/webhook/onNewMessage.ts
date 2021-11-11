import { getSocket } from 'core/socket';
import { Request, Response } from 'express';
import { EventType } from 'core/constants';
import { getUniqueId } from 'core/utils';
import { MessagePayload } from '../../core/types';

export const onNewMessage = (req: Request, res: Response) => {
  try {
    const socket = getSocket();
    const payload: MessagePayload = req.body;

    if (payload.object !== 'page') return;

    payload.entry.forEach(async (entry) => {
      const messageEvent = entry.messaging[0];
      const uuid = messageEvent.sender.id;

      if (messageEvent.message) {
        socket.emit(EventType.MESSAGE, {
          meta: { client_id: await getUniqueId() },
          author: { platform: 'messenger', uuid },
          content: { text: messageEvent.message.text },
        });
      } else if (messageEvent.postback) {

      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } catch {
    res.sendStatus(500);
  }
};
