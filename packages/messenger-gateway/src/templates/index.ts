import { getI18n } from 'core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';
import { noMatchedYetTemplate } from './no-matched-yet';
import { joinQueueSuccessTemplate } from './join-queue-success';
import { matchedTemplate } from './matched';
import { otherLeavedTemplate } from './other-leaved';

const i18n = getI18n();

export const getTemplate = (key: string): MessagePayload => {
  switch (key) {
    case 'match_found':
      return matchedTemplate
    case 'join_queue.success':
      return joinQueueSuccessTemplate
    case 'leave_match.other_leaved':
      return otherLeavedTemplate;
    default:
      return {
        text: i18n.__(key)
      }
  }
}

export {
  otherLeavedTemplate,
  joinQueueSuccessTemplate,
  noMatchedYetTemplate,
  matchedTemplate
}
