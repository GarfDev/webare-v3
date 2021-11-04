import { Request, Response } from 'express';
import { getRedisClient } from '../../core/redis';
import { MatchQueueSet } from '../../core/constants/matchQueueSet';

export const leaveQueue = async (req: Request, res: Response) => {
  const postPayload = req.body;
  const redisClient = await getRedisClient();
  await redisClient.hDel(MatchQueueSet.GENERAL, postPayload.author.id);
  return { message: 'success' };
};
