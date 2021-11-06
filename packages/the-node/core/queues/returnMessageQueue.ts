import Queue, { Job, DoneCallback } from 'bee-queue';

import { getRedisClient } from '../redis';
import { getSocket } from '../socket';

import { RedisSet } from '../constants/redisSet';
import { EventType } from '../constants/eventTypes';

export interface ReturnMessagePayload {
  receiver: {
    uuid: string;
  };
  content: {
    text: string;
  };
}

export const returnMessageQueue = new Queue<ReturnMessagePayload>(
  'returnMessageQueue',
  {
    isWorker: true,
    stallInterval: 100,
  }
);

returnMessageQueue.process(
  async (
    job: Job<ReturnMessagePayload>,
    done: DoneCallback<ReturnMessagePayload>
  ) => {
    try {
      const io = getSocket();
      const redisClient = await getRedisClient();

      const cachedClientId = await redisClient.hGet(
        RedisSet.SOCKET_ID_MAP,
        job.data.receiver.uuid
      );
      const cachedSocketId = await redisClient.hGet(
        RedisSet.CLIENT_ID_MAP,
        cachedClientId
      );

      const toEmitSocket = io.to(cachedSocketId);
      toEmitSocket.emit(EventType.RECEIVE_MESSAGE, job.data);
    } catch (e) {
      console.log(e);
    }

    done(null);
  }
);
