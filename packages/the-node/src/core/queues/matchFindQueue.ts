import { Worker, Queue, QueueEvents, QueueScheduler, Job } from 'bullmq';
import { MatchQueueSet } from '../constants/matchQueueSet';
import { RedisSet } from '../constants/redisSet';
import { getRedisClient } from '../redis';
import { returnMessageQueue } from './returnMessageQueue';

const getRandomIndex = (array: any[]): number => {
  return Math.floor(Math.random() * array.length);
};

const connection = getRedisClient();

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
    let candidates = await redisClient.hkeys(MatchQueueSet.GENERAL);
    let matchedCount = 0;

    try {
      while (true) {
        if (candidates.length < 2) {
          break;
        }

        const candidateOneIndex = getRandomIndex(candidates);
        const candidateOne = candidates.splice(candidateOneIndex, 1)[0];
        const candidateTwoIndex = getRandomIndex(candidates);
        const candidateTwo = candidates.splice(candidateTwoIndex, 1)[0];

        /**
         * Match logic
         */
        try {
            await redisClient.hdel(MatchQueueSet.GENERAL, candidateOne);
            await redisClient.hdel(MatchQueueSet.GENERAL, candidateTwo);
            job.updateProgress(30);

            await redisClient.hset(
              RedisSet.MATCHES_MAP,
              candidateOne,
              candidateTwo
            );
            await redisClient.hset(
              RedisSet.MATCHES_MAP,
              candidateTwo,
              candidateOne
            );
            job.updateProgress(60);

            await returnMessageQueue.add('message', {
              receiver: { uuid: candidateOne },
              content: { text: 'match_found', system: true },
            });

            await returnMessageQueue.add('message', {
              receiver: { uuid: candidateTwo },
              content: { text: 'match_found', system: true },
            });
            job.updateProgress(90);
            matchedCount += 1;
            job.updateProgress(100);
          } catch {
            if (job.progress >= 30) {
              // Add Candidate back to queue if something wrong
              await redisClient.hset(MatchQueueSet.GENERAL, candidateOne);
              await redisClient.hset(MatchQueueSet.GENERAL, candidateTwo);
              if (job.progress >= 60) {
                await redisClient.del(RedisSet.MATCHES_MAP, candidateOne);
                await redisClient.del(RedisSet.MATCHES_MAP, candidateTwo);
              }
            }
          }
        }

        return matchedCount;
    } catch (e) {}
  },
  {
    concurrency: 1,
    connection,
  }
);

matchFindWorker.on('completed', async (job: Job) => {
  setTimeout(() => {
    job.remove();
  }, 2000);
});

matchFindWorker.on('failed', async (job: Job) => {
  await job.retry();
});
