import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { EventType } from '../../core/constants/eventTypes';
import { RedisSet } from '../../core/constants/redisSet';
import { getRedisClient } from '../../core/redis';
import { io } from '../../index';

export const onMessage = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {
  return async (args: any) => {
    const redisClient = await getRedisClient();
    await redisClient.hSet(
      RedisSet.SOCKET_ID_MAP,
      args.author.uuid,
      args.meta.client_id
    );

    const matchedId = await redisClient.hGet(
      RedisSet.MATCHES_MAP,
      args.author.uuid
    );

    if (matchedId) {
      const matchClientId = await redisClient.hGet(
        RedisSet.SOCKET_ID_MAP,
        matchedId
      );
      const cachedSocketId = await redisClient.hGet(
        RedisSet.CLIENT_ID_MAP,
        matchClientId
      );

      const toEmitSocket = io.to(cachedSocketId) || socket;
      toEmitSocket.emit(EventType.RECEIVE_MESSAGE, {
        receiver: { uuid: matchedId },
        content: args.content,
      });
    } else {
      socket.emit(EventType.NO_ROUTING, {
        receiver: { uuid: args.author.uuid },
        content: {
          text: 'not_matched_yet'
        },
      });
    }
  };
};
