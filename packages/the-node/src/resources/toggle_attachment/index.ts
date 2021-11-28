import { Request, Response } from 'express';
import { getRedisClient } from '../../core/redis';
import { RedisSet } from '../../core/constants/redisSet';
import { returnMessageQueue } from 'core/queues/returnMessageQueue';

export const toggleAttachment = async (req: Request, res: Response) => {
  const postPayload = req.body;
  const redisClient = getRedisClient();

  try {
    const matched = await redisClient.hget(
      RedisSet.MATCHES_MAP,
      postPayload.author.id,
    );

    if (!matched) {
      return res.send({ message: 'error.failed_to_remove' });
    }

    const attachmentAllowed = await redisClient.hget(RedisSet.ATTACHMENT_ALLOWANCE, postPayload.author.id);
    const otherAllowed = await redisClient.hget(RedisSet.ATTACHMENT_ALLOWANCE, matched);
    const bothAllowed = attachmentAllowed && otherAllowed

    if (attachmentAllowed) {
      await redisClient.hdel(RedisSet.ATTACHMENT_ALLOWANCE, postPayload.author.id);

      if (bothAllowed) {
        await redisClient.hdel(RedisSet.ATTACHMENT_ALLOWANCE, matched);
      }

      return res.send({ message: 'allow_attachment.turned_off' });
    }

    await redisClient.hset(RedisSet.ATTACHMENT_ALLOWANCE, postPayload.author.id, matched);


    if (otherAllowed) {
      await returnMessageQueue.add('message', {
        receiver: { uuid: postPayload.author.id },
        content: {
          system: true,
          text: 'allow_attachment.both_allowed',
        },
      });

      await returnMessageQueue.add('message', {
        receiver: { uuid: matched },
        content: {
          system: true,
          text: 'allow_attachment.both_allowed',
        },
      });
    } else {
      await returnMessageQueue.add('message', {
        receiver: { uuid: matched },
        content: {
          system: true,
          text: 'allow_attachment.other_allowed',
        },
      });
    }



    return res.send({ message: 'allow_attachment.turned_on' });
  } catch (e) {
    return res.send({ message: 'join_queue.error' });
  }

};
