import { getI18n } from '../core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';

const i18n = getI18n();

export const leaveQueueSuccessTemplate: MessagePayload = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: i18n.__('leave_queue_success.title'),
          subtitle: i18n.__('leave_queue_success.subtitle'),
          buttons: [
            {
              type: 'postback',
              title: i18n.__('no_matched_yet.start_chatting'),
              payload: 'FIND_MATCH',
            },
          ],
        },
      ],
    },
  },
};
