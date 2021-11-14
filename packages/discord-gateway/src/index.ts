import axios from 'axios';
import dotenv from 'dotenv';
import { io } from 'socket.io-client';
import { Intents } from 'discord.js';
import { getI18n } from 'core/i18n';
import { getUniqueId } from 'core/utils/getUniqueId';
import { webareClient } from 'core/client';

dotenv.config();

export enum EventType {
  // IN
  MESSAGE = 'MESSAGE',
  HANDSHAKE = 'HANDSHAKE',
  // OUT
  MATCHED = 'MATCHED',
  RECEIVE_MESSAGE = 'RECEIVE_MESSAGE',
  NO_ROUTING = 'NO_ROUTING',
}

// Create a new client instance
export const application = () => {

  // preflight checks
  if (!process?.env?.MAIN_NODE_URL) {
    throw new Error('MAIN_NODE_URL is missing');
  }

  // flights
  const i18n = getI18n();
  const client = new webareClient({
    partials: ['CHANNEL'],
    intents: [
      'DIRECT_MESSAGES',
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
  });
  const socket = io(process?.env?.MAIN_NODE_URL);

  // When the client is ready, run this code (only once)
  client.once('ready', () => {
    console.log('Connected to Discord')
    socket.connect();
  });

  process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
  });

  socket.on('connect', async () => {
    console.log('Connected to socket')
    socket.emit(EventType.HANDSHAKE, {
      client_id: await getUniqueId(),
    });
  });

  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.author.id === client?.user?.id) return;
    if (message?.guild?.id) return;
    switch (message.content.toLowerCase()) {
      case '!find': {
        console.log(message.content);
        const res = await axios.post(
          `${process.env.MAIN_NODE_URL}/queue/join`,
          {
            author: { id: message.author.id },
          }
        );
        message.channel.send(i18n.__(res.data.message));
        break;
      }
      case '!leave': {
        const res = await axios.post(
          `${process.env.MAIN_NODE_URL}/match/leave`,
          {
            author: { platform: 'discord', id: message.author.id },
          }
        );
        message.channel.send(i18n.__(res.data.message));
        break;
      }
      case '!leave:queue': {
        const res = await axios.post(
          `${process.env.MAIN_NODE_URL}/queue/leave`,
          {
            author: { platform: 'discord', id: message.author.id },
          }
        );
        message.channel.send(i18n.__(res.data.message));
        break;
      }
      default:
        socket.emit(EventType.MESSAGE, {
          meta: { client_id: await getUniqueId() },
          author: { platform: 'discord', uuid: message.author.id },
          content: { text: message.content },
        });
    }
  });

  socket.on(EventType.RECEIVE_MESSAGE, async (message) => {
    try {
      const channel = await client.users.fetch(message.receiver.uuid);
      if (message.content.system) {
        channel.send(i18n.__(message.content.text));
      } else {
        channel.send(message.content.text);
      }
    } catch (e) {}
  });

  socket.on(EventType.NO_ROUTING, async (message) => {
    try {
      const channel = await client.users.fetch(message.receiver.uuid);
      channel.send(i18n.__(message.content.text));
    } catch (e) {}
  });

  // Login to Discord with your client's token
  client.login(process.env.BOT_TOKEN);
};

application();
