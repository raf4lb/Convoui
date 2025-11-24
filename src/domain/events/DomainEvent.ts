export enum EventType {
  MESSAGE_SENT = "MessageSent",
  CONVERSATION_ASSIGNED = "ConversationAssigned",
}

export interface DomainEvent<T = any> {
  readonly name: EventType;
  readonly occurredAt: Date;
  readonly payload: T;
}
