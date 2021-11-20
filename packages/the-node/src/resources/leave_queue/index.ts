import { Request, Response } from 'express';
import { getRedisClient } from '../../core/redis';
import { MatchQueueSet } from '../../core/constants/matchQueueSet';

export const leaveQueue = async (req: Request, res: Response) => {
  try {
    const postPayload = req.body;
    const redisClient = getRedisClient();
    await redisClient.hdel(MatchQueueSet.GENERAL, postPayload.author.id);
    return res.send({ message: 'leave_queue.success' });
  } catch {
    return res.send({ message: 'leave_queue.failed' });

  }
};
