import IORedis from 'ioredis';
import { Worker, Queue, QueueScheduler, Job } from 'bullmq';
import { Config } from 'config';
import { MatchQueueSet } from '../constants/matchQueueSet';
import { RedisSet } from '../constants/redisSet';
import { getRedisClient } from '../redis';
import { returnMessageQueue } from './returnMessageQueue';

const getRandomIndex = (array: any[]): number => {
  return Math.floor(Math.random() * array.length);
};

const connection = new IORedis(Config.REDIS_URL, { enableReadyCheck: false, maxRetriesPerRequest: null });

export const matchFindQueue = new Queue('MATCH_FIND_QUEUE', {
  connection,
});

export const matchFindQueueScheduler = new QueueScheduler('MATCH_FIND_QUEUE', {
  connection,
});

export const matchFindWorker = new Worker(
  'MATCH_FIND_QUEUE',
  async (job: Job) => {
    const redisClient = getRedisClient();
    let candidates = await redisClient.hKeys(MatchQueueSet.GENERAL);
    let matchedCount = 0;

    try {
      while (true) {
        if (candidates.length < 2) {
          break;
        }

        /**
         * Match logic
         */

        const candidateOneIndex = getRandomIndex(candidates);
        const candidateOne = candidates.splice(candidateOneIndex, 1)[0];
        const candidateTwoIndex = getRandomIndex(candidates);
        const candidateTwo = candidates.splice(candidateTwoIndex, 1)[0];

        await redisClient.hSet(
          RedisSet.MATCHES_MAP,
          candidateOne,
          candidateTwo
        );
        await redisClient.hSet(
          RedisSet.MATCHES_MAP,
          candidateTwo,
          candidateOne
        );
        await redisClient.hDel(MatchQueueSet.GENERAL, candidateOne);
        await redisClient.hDel(MatchQueueSet.GENERAL, candidateTwo);

        await returnMessageQueue.add('message', {
          receiver: { uuid: candidateOne },
          content: { text: 'match_found', system: true },
        });

        await returnMessageQueue.add('message', {
          receiver: { uuid: candidateTwo },
          content: { text: 'match_found', system: true },
        });

        matchedCount += 1;
      }
      return matchedCount;
    } catch (e) {}
  },
  {
    concurrency: 1,
    connection,
  }
);

