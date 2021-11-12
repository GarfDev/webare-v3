import { createClient } from 'redis';
import { RedisClientType } from 'redis/dist/lib/client';
import { Config } from 'config';

let client: any = null;

const createRedisClient = () => {
  client = createClient({ url: Config.REDIS_URL });
  client.on('connect', () => console.log('Redis connected'));
  client.on('error', async (err) => {
    await client.connect()
  });

  return client;
};

export const getRedisClient = (): RedisClientType<{}, {}> => {
  if (!client) {
    return createRedisClient();
  } else {
    return client;
  }
};
