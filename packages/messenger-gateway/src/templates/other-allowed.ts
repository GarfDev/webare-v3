import { getI18n } from '../core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';

const i18n = getI18n();

export const otherAllowed: MessagePayload = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: i18n.__('other_allowed.title'),
          subtitle: i18n.__('other_allowed.subtitle'),
          buttons: [
            {
              type: 'postback',
              title: i18n.__('not_allow_attachment.turn_on'),
              payload: 'TOGGLE_ATTACHMENT',
            },
          ],
        },
      ],
    },
  }
}
