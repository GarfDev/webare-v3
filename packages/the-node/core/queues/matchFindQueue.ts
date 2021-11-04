import Queue, { Job, DoneCallback } from 'bee-queue';
import { MatchQueueSet } from '../constants/matchQueueSet';
import { RedisSet } from '../constants/redisSet';
import { getRedisClient } from '../redis';

const getRandomIndex = (array: any[]): number => {
  return Math.floor(Math.random() * array.length);
};

export const matchFindQueue = new Queue('matchFindQueue', {
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

      // Match logic
      const candidateOneIndex = getRandomIndex(candidates);
      const candidateOne = candidates.splice(candidateOneIndex, 1)[0];
      const candidateTwoIndex = getRandomIndex(candidates);
      const candidateTwo = candidates.splice(candidateTwoIndex, 1)[0];

      await redisClient.hSet(RedisSet.MATCHES_MAP, candidateOne, candidateTwo);
      await redisClient.hSet(RedisSet.MATCHES_MAP, candidateTwo, candidateOne);
      await redisClient.hDel(MatchQueueSet.GENERAL, candidateOne);
      await redisClient.hDel(MatchQueueSet.GENERAL, candidateTwo);

      matchedCount += 1;
    }
  } catch (e) {
    console.log('Error while matching', e);
  }

  done(null, `Matched ${matchedCount} pair this time`);
});
