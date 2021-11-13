import { getI18n } from '../core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';

const i18n = getI18n();

export const otherLeavedTemplate: MessagePayload = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: i18n.__('other_leaved.title'),
          subtitle: i18n.__('other_leaved.subtitle'),
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
