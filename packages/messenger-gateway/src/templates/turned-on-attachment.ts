import { getI18n } from '../core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';

const i18n = getI18n();

export const turnedOnAttachment: MessagePayload = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: i18n.__('turned_on_attachment.title'),
          subtitle: i18n.__('turned_on_attachment.subtitle')
        },
      ],
    },
  }
}
