import { Request, Response } from 'express';
import { getRedisClient } from '../../core/redis'
import { RedisSet } from '../../core/constants/redisSet';

export const leaveMatch = async (req: Request, res: Response) => {
  const payload = req.body;
  const redisClient = await getRedisClient();

  const matcherId = await redisClient.hGet(RedisSet.MATCHES_MAP, payload.uuid)

  if (matcherId) {
    await redisClient.hDel(RedisSet.MATCHES_MAP, payload.uuid);
    await redisClient.hDel(RedisSet.MATCHES_MAP, matcherId);
    return res.send({ message: 'success' })
  }

  // main return
  return res.send({ message: 'no_match_to_remove' })
}
