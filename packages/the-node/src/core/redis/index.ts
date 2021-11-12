import { createClient } from 'redis';
import { RedisClientType } from 'redis/dist/lib/client';
import { Config } from 'config';

let client: any = null;

export const createRedisClient = async () => {
  client = createClient({ url: Config.REDIS_URL });
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();

  return client;
};

export const getRedisClient = (): RedisClientType<{}, {}> => {
  return client;
};
