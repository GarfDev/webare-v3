import axios from 'axios';
import dotenv from 'dotenv';
import { io } from 'socket.io-client';
import { Collection, Intents } from 'discord.js';
import { webareClient } from './client';
import { getUniqueId } from 'core/utils/getUniqueId';

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
const client = new webareClient({
  partials: ['CHANNEL'],
  intents: [
    'DIRECT_MESSAGES',
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
});
const socket = io(process.env.MAIN_NODE_URL);

// When the client is ready, run this code (only once)
client.once('ready', () => {
  socket.connect();
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

socket.on('connect', async () => {
  socket.emit(EventType.HANDSHAKE, {
    client_id: await getUniqueId(),
  });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.author.id === client.user.id) return;

  switch (message.content) {
    // case '/join queue': {
    //   const res = await axios.post('http://localhost:5000/queue/join', {
    //     author: { id: message.author.id },
    //   });
    //   message.channel.send(res.data.message);
    //   break;
    // }
    // case '/leave queue': {
    //   const res = await axios.post('http://localhost:5000/queue/leave', {
    //     author: { id: message.author.id },
    //   });
    //   message.channel.send(res.data.message);
    //   break;
    // }
    // case '/leave match': {
    //   const res = await axios.post('http://localhost:5000/match/leave', {
    //     author: { id: message.author.id },
    //   });
    //   message.channel.send(res.data.message);
    //   break;
    // }
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
    channel.send(message.content.text);
  } catch (e) {
  }
});

socket.on(EventType.NO_ROUTING, async (message) => {
  try {
    const channel = await client.users.fetch(message.receiver.uuid);
    channel.send(message.content.text);
  } catch (e) {
  }
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);
