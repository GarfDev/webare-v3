import express from 'express';
import cors from 'cors';

import { createReturnMessage } from 'core/queues/returnMessageQueue';
import { createMatchFindQueue } from 'core/queues/matchFindQueue';
import { EventType } from './core/constants/eventTypes';
import { RedisSet } from './core/constants/redisSet';
import { onHandshake } from './listeners/onHandshake';
import { onMessage } from './listeners/onMessages';

import { getRedisClient } from './core/redis';
import { createSocketServer } from './core/socket';
import { rootRouter } from './routers';

const application = async () => {
  const PORT = 5000;
  const app = express();

  await getRedisClient();
  await createReturnMessage();
  await createMatchFindQueue();

  app.use(cors({ origin: '*' }));
  app.use(express.json());


  app.use(rootRouter);

  const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });

  // Socket setup
  const io = createSocketServer(server);

  io.on('connection', function (socket) {
    socket.on(EventType.HANDSHAKE, onHandshake(socket));
    socket.on(EventType.MESSAGE, onMessage(socket));

    socket.on('disconnect', async () => {
      try {
        const redisClient = await getRedisClient();
        const clientIdSet = (await redisClient.hGetAll(
          RedisSet.CLIENT_ID_MAP
        )) as Object;
        const clientIdKey = Object.keys(clientIdSet);
        clientIdKey.forEach(async (cur) => {
          if (clientIdSet[cur] === socket.id) {
            console.log('Deleting', socket.id)
            await redisClient.hDel(RedisSet.CLIENT_ID_MAP, socket.id);
          };
        });
      } catch {}
    });
  });
};

application();
