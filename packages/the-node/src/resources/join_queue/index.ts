import { Request, Response } from 'express';
import { getRedisClient } from '../../core/redis';
import { matchFindQueue } from '../../core/queues/matchFindQueue';
import { MatchQueueSet } from '../../core/constants/matchQueueSet';
import { RedisSet } from '../../core/constants/redisSet';

export const joinQueue = async (req: Request, res: Response) => {
  const postPayload = req.body;
  const redisClient = await getRedisClient();
  try {
    const matched = await redisClient.hGet(
      RedisSet.MATCHES_MAP,
      postPayload.author.id,
    );
    if (matched) {
      return res.send({ message: 'error.already_matched' });
    }

    await redisClient.hSet(MatchQueueSet.GENERAL, postPayload.author.id, '');
    await matchFindQueue.createJob({}).save();

    return res.send({ message: 'join_queue.success' });
  } catch (e) {
    return res.send({ message: 'join_queue.error' });
  }
};
