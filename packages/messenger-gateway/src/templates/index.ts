import { getI18n } from 'core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';
import { noMatchedYetTemplate } from './no-matched-yet';
import { joinQueueSuccessTemplate } from './join-queue-success';
import { leaveQueueSuccessTemplate } from './leave-queue-success';
import { otherLeavedTemplate } from './other-leaved';
import { matchedTemplate } from './matched';

const i18n = getI18n();

export const getTemplate = (key: string): MessagePayload => {
  switch (key) {
    case 'match_found':
      return matchedTemplate
    case 'join_queue.success':
      return joinQueueSuccessTemplate
    case 'leave_match.other_leaved':
      return otherLeavedTemplate;
    case 'leave_match.success':
      return leaveQueueSuccessTemplate
    default:
      return {
        text: i18n.__(key)
      }
  }
}

export {
  otherLeavedTemplate,
  leaveQueueSuccessTemplate,
  joinQueueSuccessTemplate,
  noMatchedYetTemplate,
  matchedTemplate
}
