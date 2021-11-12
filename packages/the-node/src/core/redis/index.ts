import { createClient } from 'redis';
import { RedisClientType } from 'redis/dist/lib/client';

let client: any = null;

const createRedisClient = async () => {
  client = createClient({ url: 'redis://localhost:6379'
});
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();

  return client;
};

export const getRedisClient = async (): Promise<RedisClientType<{}, {}>> => {
  if (!client) {
    return await createRedisClient();
  } else {
    return client;
  }
};
