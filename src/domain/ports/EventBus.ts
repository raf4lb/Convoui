import { DomainEvent } from "../events/DomainEvent";

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

/**
 * Port (interface) for publishing events and subscribing handlers.
 * Use cases and domain depend on this interface.
 */
export interface IEventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): () => void; // returns unsubscribe
}
