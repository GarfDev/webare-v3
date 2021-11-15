import log from 'npmlog';
import { Worker, Queue, Job } from 'bullmq';

import { getRedisClient } from '../redis';
import { getSocket } from '../socket';

import { RedisSet } from '../constants/redisSet';
import { EventType } from '../constants/eventTypes';
import { Config } from 'config';

export interface ReturnMessagePayload {
  receiver: {
    uuid: string;
  };
  content: {
    system?: boolean;
    text: string;
  };
}

export const returnMessageQueue = new Queue<ReturnMessagePayload>(
  'return_message_queue',
  {
    connection: {
      port: Config.REDIS_PORT, // Redis port
      host: Config.REDIS_HOST, // Redis host
      password: Config.REDIS_PASSWORD,
    },
  }
);

export const returnMessageWorker = new Worker(
  'return_message_queue',
  async (job: Job) => {
    try {
      const io = getSocket();
      const redisClient = await getRedisClient();

      const cachedClientId = await redisClient.hGet(
        RedisSet.SOCKET_ID_MAP,
        job.data.receiver.uuid
      );
      if (!cachedClientId) return;
      const cachedSocketId = await redisClient.hGet(
        RedisSet.CLIENT_ID_MAP,
        cachedClientId
      );
      if (cachedSocketId) {
        const toEmitSocket = io.to(cachedSocketId);
        toEmitSocket.emit(EventType.RECEIVE_MESSAGE, job.data);
      }
      job.updateProgress(100);
      const now = new Date().getTime();
      log.info('[Message]', `transfer take ${now - job.timestamp}ms`)
    } catch (e) {}
  },
  {
    concurrency: 50,
    connection: {
      port: Config.REDIS_PORT, // Redis port
      host: Config.REDIS_HOST, // Redis host
      password: Config.REDIS_PASSWORD,
    },
  }
);
