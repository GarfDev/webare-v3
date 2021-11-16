import express from 'express';
import dotenv from 'dotenv';

import { createSocketClient } from './core/socket';

import { EventType } from './core/constants';
import { getI18n } from './core/i18n';
import { getUniqueId } from './core/utils';

import { verify } from './resources/webhook/verify';
import { sendMessage } from './resources/webhook/sendMessage';
import { onNewMessage } from './resources/webhook/onNewMessage';
import { healCheck } from './resources/health-check';

import { getTemplate, noMatchedYetTemplate } from './templates';

dotenv.config();

const application = async () => {
  const i18n = getI18n();
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const socket = createSocketClient();
  socket.connect();

  app.get('/webhook', verify);
  app.post('/webhook', onNewMessage);
  app.get('/health', healCheck);

  socket.on('connect', async () => {
    socket.emit(EventType.HANDSHAKE, {
      client_id: await getUniqueId(),
    });
  });

  socket.on(EventType.RECEIVE_MESSAGE, async (message) => {
    try {
      if (message.content.system) {
        await sendMessage({
          messaging_type: 'RESPONSE',
          recipient: {
            id: message.receiver.uuid,
          },
          message: getTemplate(message.content.text),
        });

      } else {
        await sendMessage({
          messaging_type: 'RESPONSE',
          recipient: {
            id: message.receiver.uuid,
          },
          message: {
            text: message.content.text,
          },
        });
      }
    } catch (e) {}
  });

  socket.on(EventType.NO_ROUTING, async (message) => {
    try {
      await sendMessage({
        messaging_type: 'RESPONSE',
        recipient: {
          id: message.receiver.uuid,
        },
        message: noMatchedYetTemplate,
      });
    } catch (e) {}
  });

  // app.post('/webhook', (req, res) => {

  // listen for requests :)
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + process.env.PORT);
  });
};

application();
