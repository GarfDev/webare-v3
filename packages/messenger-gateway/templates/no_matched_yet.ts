import { getI18n } from '../core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';

const i18n = getI18n();

export const noMatchedYetTemplate: MessagePayload = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: i18n.__('no_matched_yet.title'),
          subtitle: i18n.__('no_matched_yet.subtitle'),
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
  }
}
