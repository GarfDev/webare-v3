import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { RedisSet } from '../../core/constants/redisSet';
import { getRedisClient } from '../../core/redis';

export const onHandshake = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {

  return async (args: any) => {
    const redisClient = await getRedisClient();
    const clientId = args.client_id;
    redisClient.hset(RedisSet.CLIENT_ID_MAP, clientId, socket.id)
  };
};
