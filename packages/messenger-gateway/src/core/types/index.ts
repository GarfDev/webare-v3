export interface Sender {
  id: string;
}

export interface Recipient {
  id: string;
}

export interface MessageAttachment { type: 'string', payload: { url?: string, sticker_id?: string } }

export interface Message {
  mid: string;
  text?: string;
  attachments?: MessageAttachment[];
}

export interface Postback {
  title: string;
  payload: string;
  mid: string;
}

export interface MessageEvent {
  sender: Sender;
  recipient: Recipient;
  timestamp: number;
  message?: Message;
  postback?: Postback;
}

export interface Entry {
  id: string;
  time: number;
  messaging: MessageEvent[];
}

export interface MessagePayload {
  object: string;
  entry: Entry[];
}
