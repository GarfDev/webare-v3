import { getI18n } from '../core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';

const i18n = getI18n();

export const matchedTemplate: MessagePayload = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: i18n.__('matched.title'),
          subtitle: i18n.__('matched.subtitle'),
        },
      ],
    },
  },
};
