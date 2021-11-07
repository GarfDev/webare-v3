import { Request, Response } from 'express';
import { getRedisClient } from '../../core/redis'
import { RedisSet } from '../../core/constants/redisSet';

export const leaveMatch = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const redisClient = await getRedisClient();

    const matcherId = await redisClient.hGet(RedisSet.MATCHES_MAP, payload.author.id)

    if (matcherId) {
      await redisClient.hDel(RedisSet.MATCHES_MAP, payload.author.id);
      await redisClient.hDel(RedisSet.MATCHES_MAP, matcherId);
      return res.send({ message: 'success' })
    }
  } catch {
    return res.send({ message: 'failed_to_remove' })

  }
  // main return
  return res.send({ message: 'no_match_to_remove' })
}
