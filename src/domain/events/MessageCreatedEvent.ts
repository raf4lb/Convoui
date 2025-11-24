import { Message } from "../entities/Message";

import { DomainEvent, EventType } from "./DomainEvent";

export type MessageSentPayload = {
  conversationId: string;
  message: Message;
  source?: string;
};

export class MessageSentEvent implements DomainEvent<MessageSentPayload> {
  public readonly name = EventType.MESSAGE_SENT;
  public readonly occurredAt: Date;
  constructor(public readonly payload: MessageSentPayload) {
    this.occurredAt = new Date();
  }
}
