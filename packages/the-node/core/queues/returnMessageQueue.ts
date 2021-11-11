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
    system?: boolean;
    text: string;
  };
}

export const returnMessageQueue = new Queue<ReturnMessagePayload>(
  'return_message_queue',
  {
    isWorker: true,
    stallInterval: 100,
    removeOnSuccess: true,
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
      console.log(cachedSocketId);
      const toEmitSocket = io.to(cachedSocketId);
      toEmitSocket.emit(EventType.RECEIVE_MESSAGE, job.data);
    } catch (e) {
      console.log(e);
    }

    done(null);
  }
);
