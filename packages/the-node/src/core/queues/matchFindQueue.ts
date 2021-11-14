import { Config } from 'config';
import { Worker, Queue, QueueScheduler, Job } from 'bullmq';
import { MatchQueueSet } from '../constants/matchQueueSet';
import { RedisSet } from '../constants/redisSet';
import { getRedisClient } from '../redis';
import { returnMessageQueue } from './returnMessageQueue';

const getRandomIndex = (array: any[]): number => {
  return Math.floor(Math.random() * array.length);
};

export const matchFindQueue = new Queue('MATCH_FIND_QUEUE', {
  connection: {
    port: Config.REDIS_PORT, // Redis port
    host: Config.REDIS_HOST, // Redis host
    password: Config.REDIS_PASSWORD,
  },
});

export const matchFindQueueScheduler = new QueueScheduler('MATCH_FIND_QUEUE', {
  connection: {
    port: Config.REDIS_PORT, // Redis port
    host: Config.REDIS_HOST, // Redis host
    password: Config.REDIS_PASSWORD,
  },
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
    } catch (e) {}
  },
  {
    concurrency: 1,
    connection: {
      port: Config.REDIS_PORT, // Redis port
      host: Config.REDIS_HOST, // Redis host
      password: Config.REDIS_PASSWORD,
    },
  }
);

// matchFindQueue.process(async (_: Job<any>, done: DoneCallback<any>) => {
//   const redisClient = getRedisClient();
//   let candidates = await redisClient.hKeys(MatchQueueSet.GENERAL);
//   let matchedCount = 0;

//   try {
//     while (true) {
//       if (candidates.length < 2) {
//         break;
//       }

//       /**
//        * Match logic
//        */

//       const candidateOneIndex = getRandomIndex(candidates);
//       const candidateOne = candidates.splice(candidateOneIndex, 1)[0];
//       const candidateTwoIndex = getRandomIndex(candidates);
//       const candidateTwo = candidates.splice(candidateTwoIndex, 1)[0];

//       await redisClient.hSet(RedisSet.MATCHES_MAP, candidateOne, candidateTwo);
//       await redisClient.hSet(RedisSet.MATCHES_MAP, candidateTwo, candidateOne);
//       await redisClient.hDel(MatchQueueSet.GENERAL, candidateOne);
//       await redisClient.hDel(MatchQueueSet.GENERAL, candidateTwo);

//       await returnMessageQueue
//         .createJob({
//           receiver: { uuid: candidateOne },
//           content: { text: 'match_found', system: true },
//         })
//         .save();
//       await returnMessageQueue
//         .createJob({
//           receiver: { uuid: candidateTwo },
//           content: { text: 'match_found', system: true },
//         })
//         .save();

//       matchedCount += 1;
//     }
//   } catch (e) {}

//   done(null, `Matched ${matchedCount} pair this time`);
// });
