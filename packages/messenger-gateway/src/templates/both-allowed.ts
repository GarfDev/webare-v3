import { getI18n } from '../core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';

const i18n = getI18n();

export const bothAllowed: MessagePayload = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: i18n.__('both_allowed.title'),
          subtitle: i18n.__('both_allowed.subtitle')
        },
      ],
    },
  }
}
