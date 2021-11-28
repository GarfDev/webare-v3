import { getI18n } from '../core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';

const i18n = getI18n();

export const attachmentOff: MessagePayload = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: i18n.__('attachment_off.title'),
          subtitle: i18n.__('attachment_off.subtitle')
        },
      ],
    },
  }
}
