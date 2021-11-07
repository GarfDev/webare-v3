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
      return res.send({ message: 'leave_match.success', system: true })
    }
  } catch {
    return res.send({ message: 'error.failed_to_remove', system: true })

  }
  // main return
  return res.send({ message: 'error.not_matched_yet', system: true })
}
