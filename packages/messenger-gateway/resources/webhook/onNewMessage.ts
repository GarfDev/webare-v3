import { Request, Response } from 'express';
import { MessagePayload } from '../../core/types';
import { sendMessage } from './sendMessage';

export const onNewMessage = (req: Request, res: Response) => {
  try {
    const payload: MessagePayload = req.body;
    if (payload.object !== 'page') return;

    payload.entry.forEach(async (entry) => {
      const messageEvent = entry.messaging[0];
      const uuid = messageEvent.sender.id;

      if (messageEvent.message) {
        await sendMessage({
          messaging_type: 'RESPONSE',
          recipient: {
            id: uuid,
          },
          message: {
            text: messageEvent.message.text,
          },
        });
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } catch {
    res.sendStatus(500);
  }
};
