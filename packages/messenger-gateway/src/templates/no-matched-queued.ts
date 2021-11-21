import { getI18n } from '../core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';

const i18n = getI18n();

export const noMatchedQueuedTemplate: MessagePayload = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: i18n.__('no_matched_queued.title'),
          subtitle: i18n.__('no_matched_queued.subtitle'),
          buttons: [
            {
              type: 'postback',
              title: i18n.__('join_queue_success.cancel'),
              payload: 'LEAVE_QUEUE',
            },
          ],
        },
      ],
    },
  }
}
