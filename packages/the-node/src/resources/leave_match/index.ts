import { Request, Response } from 'express';
import { getRedisClient } from '../../core/redis'
import { RedisSet } from '../../core/constants/redisSet';
import { returnMessageQueue } from 'core/queues/returnMessageQueue';

export const leaveMatch = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const redisClient = getRedisClient();

    const matcherId = await redisClient.hget(RedisSet.MATCHES_MAP, payload.author.id)

    if (matcherId) {
      await redisClient.hdel(RedisSet.MATCHES_MAP, payload.author.id);
      await redisClient.hdel(RedisSet.MATCHES_MAP, matcherId);

      await returnMessageQueue.add('message', {
        receiver: { uuid: matcherId },
        content: {
          system: true,
          text: 'leave_match.other_leaved',
        },
      });

      return res.send({ message: 'leave_match.success', system: true })
    }
  } catch {
    return res.send({ message: 'error.failed_to_remove', system: true })
  }
  // main return
}
