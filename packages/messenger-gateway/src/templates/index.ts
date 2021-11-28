import { getI18n } from 'core/i18n';
import type { MessagePayload } from '../resources/webhook/sendMessage';
import { noMatchedYetTemplate } from './no-matched-yet';
import { joinQueueSuccessTemplate } from './join-queue-success';
import { leaveQueueSuccessTemplate } from './leave-queue-success';
import { leaveMatchSuccessTemplate } from './leave-match-success';
import { noMatchedQueuedTemplate } from './no-matched-queued';
import { alreadyMatchedTemplate } from './already-matched';
import { otherLeavedTemplate } from './other-leaved';
import { matchedTemplate } from './matched';
import { notAllowAttachment } from './not-allow-attachment';
import { otherAllowed } from './other-allowed';
import { turnedOnAttachment } from './turned-on-attachment';
import { bothAllowed } from './both-allowed';
import { attachmentOff } from './attachment-off';

const i18n = getI18n();

export const getTemplate = (key: string): MessagePayload => {
  switch (key) {
    case 'match_found':
      return matchedTemplate
    case 'join_queue.success':
      return joinQueueSuccessTemplate
    case 'leave_match.other_leaved':
      return otherLeavedTemplate;
    case 'leave_queue.success':
      return leaveQueueSuccessTemplate;
    case 'leave_match.success':
      return leaveMatchSuccessTemplate
    case 'error.other_not_allow_attachment':
      return notAllowAttachment;
    case 'error.already_matched':
      return alreadyMatchedTemplate;
    case 'allow_attachment.other_allowed':
      return otherAllowed;
    case 'allow_attachment.turned_off':
      return attachmentOff;
    case 'allow_attachment.both_allowed':
      return bothAllowed;
    case 'allow_attachment.turned_on':
      return turnedOnAttachment
    default:
      return {
        text: i18n.__(key)
      }
  }
}

export {
  bothAllowed,
  otherAllowed,
  attachmentOff,
  turnedOnAttachment,
  notAllowAttachment,
  noMatchedQueuedTemplate,
  otherLeavedTemplate,
  alreadyMatchedTemplate,
  leaveQueueSuccessTemplate,
  leaveMatchSuccessTemplate,
  joinQueueSuccessTemplate,
  noMatchedYetTemplate,
  matchedTemplate
}
