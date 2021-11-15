import { getI18n } from '../core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';

const i18n = getI18n();

export const alreadyMatchedTemplate: MessagePayload = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: i18n.__('already_matched.title'),
          subtitle: i18n.__('already_matched.subtitle'),
          buttons: [
            {
              type: 'postback',
              title: i18n.__('already_matched.stop_chatting'),
              payload: 'END_MATCH',
            },
          ],
        },
      ],
    },
  },
};
