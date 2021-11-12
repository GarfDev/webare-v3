import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { EventType } from '../../core/constants/eventTypes';
import { RedisSet } from '../../core/constants/redisSet';
import { getRedisClient } from '../../core/redis';

import { returnMessageQueue } from '../../core/queues/returnMessageQueue';

export const onMessage = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {
  return async (args: any) => {
    const redisClient = getRedisClient();
    await redisClient.hSet(
      RedisSet.SOCKET_ID_MAP,
      args.author.uuid,
      args.meta.client_id
    );

    const matchedId = await redisClient.hGet(
      RedisSet.MATCHES_MAP,
      args.author.uuid
    );
    console.log(`[${args.author.platform}] ${args.content.text}`)
    if (matchedId) {
      await returnMessageQueue.createJob({
        receiver: { uuid: matchedId },
        content: args.content,
      }).save();
    } else {
      socket.emit(EventType.NO_ROUTING, {
        receiver: { uuid: args.author.uuid },
        content: {
          system: true,
          text: 'error.not_matched_yet',
        },
      });
    }
  };
};
