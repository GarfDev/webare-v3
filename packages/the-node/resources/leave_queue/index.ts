import { Request, Response } from 'express';
import { getRedisClient } from '../../core/redis';
import { MatchQueueSet } from '../../core/constants/matchQueueSet';

export const leaveQueue = async (req: Request, res: Response) => {
  try {
    const postPayload = req.body;
    const redisClient = await getRedisClient();
    await redisClient.hDel(MatchQueueSet.GENERAL, postPayload.author.id);
    return { message: 'leave_queue.success' };
  } catch {
    return { message: 'leave_queue.failed' };
  }
};
