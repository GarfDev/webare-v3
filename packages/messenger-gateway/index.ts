import express from 'express';
import dotenv from 'dotenv';

import { createSocketClient } from './core/socket';

import { verify } from './resources/webhook/verify';
import { sendMessage } from './resources/webhook/sendMessage';
import { onNewMessage } from './resources/webhook/onNewMessage';
import { EventType } from 'core/constants';
import { getUniqueId } from 'core/utils';

import { noMatchedYetTemplate } from './templates';

dotenv.config();

const application = async () => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const socket = createSocketClient();
  socket.connect();

  app.get('/webhook', verify);
  app.post('/webhook', onNewMessage);

  socket.on('connect', async () => {
    socket.emit(EventType.HANDSHAKE, {
      client_id: await getUniqueId(),
    });
  });

  socket.on(EventType.RECEIVE_MESSAGE, async (message) => {
    try {
      await sendMessage({
        messaging_type: 'RESPONSE',
        recipient: {
          id: message.receiver.uuid,
        },
        message: {
          text: message.content.text,
        },
      });
    } catch (e) {}
  });

  socket.on(EventType.NO_ROUTING, async (message) => {
    try {
      await sendMessage({
        messaging_type: 'RESPONSE',
        recipient: {
          id: message.receiver.uuid,
        },
        message: noMatchedYetTemplate,
      });
    } catch (e) {}
  });

  // app.post('/webhook', (req, res) => {
  //   let body = req.body;
  //   console.log(JSON.stringify(body));
  //   // Checks if this is an event from a page subscription
  //   if (body.object === 'page') {
  //     // Iterates over each entry - there may be multiple if batched
  //     body.entry.forEach(function (entry) {
  //       // Gets the body of the webhook event
  //       let webhookEvent = entry.messaging[0];
  //       console.log(webhookEvent);

  //       // Get the sender PSID
  //       let senderPsid = webhookEvent.sender.id;
  //       console.log('Sender PSID: ' + senderPsid);

  //       // Check if the event is a message or postback and
  //       // pass the event to the appropriate handler function
  //       if (webhookEvent.message) {
  //         handleMessage(senderPsid, webhookEvent.message);
  //       } else if (webhookEvent.postback) {
  //         handlePostback(senderPsid, webhookEvent.postback);
  //       }
  //     });

  //     // Returns a '200 OK' response to all requests
  //     res.status(200).send('EVENT_RECEIVED');
  //   } else {
  //     // Returns a '404 Not Found' if event is not from a page subscription
  //     res.sendStatus(404);
  //   }
  // });

  // function handleMessage(senderPsid, receivedMessage) {
  //   let response;

  //   // Checks if the message contains text
  //   if (receivedMessage.text) {
  //     // Create the payload for a basic text message, which
  //     // will be added to the body of your request to the Send API
  //     response = {
  //       text: `You sent the message: '${receivedMessage.text}'. Now send me an attachment!`,
  //     };
  //   } else if (receivedMessage.attachments) {
  //     // Get the URL of the message attachment
  //     let attachmentUrl = receivedMessage.attachments[0].payload.url;
  //     response = {
  //       attachment: {
  //         type: 'template',
  //         payload: {
  //           template_type: 'generic',
  //           elements: [
  //             {
  //               title: 'Is this the right picture?',
  //               subtitle: 'Tap a button to answer.',
  //               image_url: attachmentUrl,
  //               buttons: [
  //                 {
  //                   type: 'postback',
  //                   title: 'Yes!',
  //                   payload: 'yes',
  //                 },
  //                 {
  //                   type: 'postback',
  //                   title: 'No!',
  //                   payload: 'no',
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       },
  //     };
  //   }

  //   // Send the response message
  //   callSendAPI(senderPsid, response);
  // }

  // // Handles messaging_postbacks events
  // function handlePostback(senderPsid, receivedPostback) {
  //   let response;

  //   // Get the payload for the postback
  //   let payload = receivedPostback.payload;

  //   // Set the response based on the postback payload
  //   if (payload === 'yes') {
  //     response = { text: 'Thanks!' };
  //   } else if (payload === 'no') {
  //     response = { text: 'Oops, try sending another image.' };
  //   }
  //   // Send the message to acknowledge the postback
  //   callSendAPI(senderPsid, response);
  // }

  // // Sends response messages via the Send API
  // function callSendAPI(senderPsid, response) {
  //   // The page access token we have generated in your app settings
  //   const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  //   // Construct the message body
  //   let requestBody = {
  //     recipient: {
  //       id: senderPsid,
  //     },
  //     message: response,
  //   };

  //   // Send the HTTP request to the Messenger Platform
  //   request(
  //     {
  //       uri: 'https://graph.facebook.com/v2.6/me/messages',
  //       qs: { access_token: PAGE_ACCESS_TOKEN },
  //       method: 'POST',
  //       json: requestBody,
  //     },
  //     (err, _res, _body) => {
  //       if (!err) {
  //         console.log('Message sent!');
  //       } else {
  //         console.error('Unable to send message:' + err);
  //       }
  //     }
  //   );
  // }

  // listen for requests :)
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + process.env.PORT);
  });
};

application();
