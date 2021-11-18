import IORedis from 'ioredis';
import { Config } from 'config';
import { logger } from 'logger';

let client: IORedis.Redis | null = null;

const createRedisClient = () => {
  client = new IORedis(Config.REDIS_URL, { enableReadyCheck: false, maxRetriesPerRequest: null });
  client.on('connect', () => {
    logger.info(`connected to redis server ${Config.REDIS_HOST}`)
  });
  client.on('error', (err) => {

  });

  return client;
};

export const getRedisClient = (): IORedis.Redis => {
  if (!client) {
    return createRedisClient();
  } else {
    return client;
  }
};
