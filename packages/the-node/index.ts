import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';

import { EventType } from './core/constants/eventTypes';
import { RedisSet } from './core/constants/redisSet';
import { onHandshake } from './listeners/onHandshake';
import { onMessage } from './listeners/onMessages';

import { getI18n } from './core/i18n';
import { getRedisClient } from './core/redis';
import { rootRouter } from './routers';

export let io: Server = null;

const application = async () => {
  const PORT = 5000;
  const app = express();
  const i18n = getI18n();

  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use(i18n.init);

  await getRedisClient();

  app.use(rootRouter);

  const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });

  // Socket setup
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', function (socket) {
    socket.on(EventType.HANDSHAKE, onHandshake(socket));
    socket.on(EventType.MESSAGE, onMessage(socket));

    socket.on('disconnect', async () => {
      const redisClient = await getRedisClient();
      const clientIdSet = (await redisClient.hGetAll(
        RedisSet.CLIENT_ID_MAP
      )) as Object;
      const clientIdKey = Object.keys(clientIdSet);
      const toRemoveKey = clientIdKey.reduce((pre, cur) => {
        if (clientIdSet[cur] === socket.id) return cur;
      }, '');
      await redisClient.hDel(RedisSet.CLIENT_ID_MAP, toRemoveKey);
    });
  });
};

application();
