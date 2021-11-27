import log from 'npmlog';
import IORedis from 'ioredis';
import { Worker, Queue, Job, QueueEvents, QueueScheduler } from 'bullmq';

import { getRedisClient } from '../redis';
import { getSocket } from '../socket';

import { RedisSet } from '../constants/redisSet';
import { EventType } from '../constants/eventTypes';


export interface ReturnMessageAttachment {
  type: 'image' | 'audio' | 'video' | 'file' | 'location',
  payload: {
    url?: string;
    sticker_id?: string;
  }
}

export interface ReturnMessagePayload {
  receiver: {
    uuid: string;
  };
  content: {
    attachment?: ReturnMessageAttachment;
    system?: boolean;
    text?: string;
  };
}

const connection = getRedisClient();

export const returnMessageQueue = new Queue<ReturnMessagePayload>(
  'return_message_queue',
  {
    connection,
    defaultJobOptions: {
      removeOnFail: true,
      removeOnComplete: true,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  }
);

export const returnMessageScheduler = new QueueScheduler(
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
