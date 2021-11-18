import log from 'npmlog';
import IORedis from 'ioredis';
import { Worker, Queue, Job, QueueEvents } from 'bullmq';

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

const connection = getRedisClient().duplicate();

export const returnMessageQueue = new Queue<ReturnMessagePayload>(
  'return_message_queue',
  {
    connection,
  }
);

export const returnMessageWorker = new Worker(
  'return_message_queue',
  async (job: Job) => {
    try {
      const io = getSocket();
      const redisClient = getRedisClient();

      const cachedClientId = await redisClient.hget(
        RedisSet.SOCKET_ID_MAP,
        job.data.receiver.uuid
      );
      if (!cachedClientId) return;
      const cachedSocketId = await redisClient.hget(
        RedisSet.CLIENT_ID_MAP,
        cachedClientId
      );
      if (cachedSocketId) {
        const toEmitSocket = io.to(cachedSocketId);
        toEmitSocket.emit(EventType.RECEIVE_MESSAGE, job.data);
      }
      job.updateProgress(100);
    } catch (e) {}
  },
  {
    concurrency: 50,
    connection,
  }
);
