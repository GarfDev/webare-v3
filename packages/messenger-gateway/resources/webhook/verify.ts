import { Request, Response } from 'express';

require('dotenv').config();

export const verify = (req: Request, res: Response) => {
  // Your verify token. Should be a random string.
  const BOT_TOKEN = process.env.BOT_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === BOT_TOKEN) {
      // Responds with the challenge token from the request
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};
