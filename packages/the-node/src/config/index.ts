import dotenv from 'dotenv';

dotenv.config();

export const Config = {
  REDIS_URL: process.env.REDIS_URL,
};
