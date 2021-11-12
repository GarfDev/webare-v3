import Queue, { Job, DoneCallback } from 'bee-queue';
import { MatchQueueSet } from '../constants/matchQueueSet';
import { RedisSet } from '../constants/redisSet';
import { getRedisClient } from '../redis';
import { returnMessageQueue } from './returnMessageQueue';

const getRandomIndex = (array: any[]): number => {
  return Math.floor(Math.random() * array.length);
};

const redis = getRedisClient();

export const matchFindQueue = new Queue('match_find_queue', {
  redis: redis,
  isWorker: true,
  stallInterval: 5000,
  delayedDebounce: 5000,
});

matchFindQueue.process(async (_: Job<any>, done: DoneCallback<any>) => {
  const redisClient = await getRedisClient();
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

      await redisClient.hSet(RedisSet.MATCHES_MAP, candidateOne, candidateTwo);
      await redisClient.hSet(RedisSet.MATCHES_MAP, candidateTwo, candidateOne);
      await redisClient.hDel(MatchQueueSet.GENERAL, candidateOne);
      await redisClient.hDel(MatchQueueSet.GENERAL, candidateTwo);

      await returnMessageQueue
        .createJob({
          receiver: { uuid: candidateOne },
          content: { text: 'match_found', system: true },
        })
        .save();
      await returnMessageQueue
        .createJob({
          receiver: { uuid: candidateTwo },
          content: { text: 'match_found', system: true },
        })
        .save();

      matchedCount += 1;
    }
  } catch (e) {}

  done(null, `Matched ${matchedCount} pair this time`);
});
