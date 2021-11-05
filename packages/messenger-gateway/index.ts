import dotenv from 'dotenv';
import { MessengerClient } from 'messaging-api-messenger';

dotenv.config();

const application = async () => {
  const client = new MessengerClient({
    accessToken: process.env.BOT_TOKEN,
  });

}

application();
