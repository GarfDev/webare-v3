import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { EventType } from '../../core/constants/eventTypes';
import { RedisSet } from '../../core/constants/redisSet';
import { getRedisClient } from '../../core/redis';

import { returnMessageQueue } from '../../core/queues/returnMessageQueue';
import { MatchQueueSet } from 'core/constants/matchQueueSet';

export const onMessage = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {
  return async (args: any) => {
    const redisClient = await getRedisClient();
    await redisClient.hset(
      RedisSet.SOCKET_ID_MAP,
      args.author.uuid,
      args.meta.client_id
    );

    const matchedId = await redisClient.hget(
      RedisSet.MATCHES_MAP,
      args.author.uuid
    );

    if (matchedId) {
      await returnMessageQueue.add('message', {
        receiver: { uuid: matchedId },
        content: args.content,
      });
    } else {
      const isQueued = await redisClient.hget(
        MatchQueueSet.GENERAL,
        args.author.uuid
      );

      socket.emit(EventType.NO_ROUTING, {
        receiver: { uuid: args.author.uuid },
        content: {
          system: true,
          text: isQueued
            ? 'error.not_matched_yet_queued'
            : 'error.not_matched_yet',
        },
      });
    }
  };
};
