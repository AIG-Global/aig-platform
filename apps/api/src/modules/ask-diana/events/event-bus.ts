/**
 * Event Bus
 * 
 * Publishes events for Ask Diana lifecycle:
 * - conversation created/updated/deleted
 * - tool executed
 * - memory updated
 * - response completed
 * - error occurred
 * 
 * Enables clean integration without tight coupling
 */

export type EventType =
  | 'conversation:created'
  | 'conversation:updated'
  | 'conversation:deleted'
  | 'message:created'
  | 'tool:executed'
  | 'tool:failed'
  | 'memory:updated'
  | 'response:started'
  | 'response:completed'
  | 'response:failed'
  | 'error:occurred'

export interface AskDianaEvent {
  type: EventType
  timestamp: Date
  data: Record<string, any>
  metadata?: {
    userId?: string
    conversationId?: string
    correlationId?: string
  }
}

export type EventHandler = (event: AskDianaEvent) => Promise<void> | void

export class EventBus {
  private handlers = new Map<EventType, Set<EventHandler>>()
  private eventHistory: AskDianaEvent[] = []
  private maxHistorySize = 1000

  /**
   * Subscribe to an event type
   */
  subscribe(eventType: EventType, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }

    this.handlers.get(eventType)!.add(handler)

    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler)
    }
  }

  /**
   * Subscribe to all events
   */
  subscribeAll(handler: EventHandler): () => void {
    const allTypes: EventType[] = [
      'conversation:created',
      'conversation:updated',
      'conversation:deleted',
      'message:created',
      'tool:executed',
      'tool:failed',
      'memory:updated',
      'response:started',
      'response:completed',
      'response:failed',
      'error:occurred',
    ]

    const unsubscribers = allTypes.map((type) =>
      this.subscribe(type, handler),
    )

    return () => {
      unsubscribers.forEach((unsub) => unsub())
    }
  }

  /**
   * Publish an event
   */
  async publish(event: AskDianaEvent): Promise<void> {
    // Add to history
    this.eventHistory.push(event)
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift()
    }

    // Call handlers
    const handlers = this.handlers.get(event.type)
    if (handlers) {
      const promises = Array.from(handlers).map((handler) =>
        Promise.resolve(handler(event)),
      )
      await Promise.allSettled(promises)
    }
  }

  /**
   * Publish multiple events
   */
  async publishBatch(events: AskDianaEvent[]): Promise<void> {
    await Promise.all(events.map((e) => this.publish(e)))
  }

  /**
   * Get event history
   */
  getHistory(
    type?: EventType,
    limit: number = 100,
  ): AskDianaEvent[] {
    let events = this.eventHistory

    if (type) {
      events = events.filter((e) => e.type === type)
    }

    return events.slice(-limit)
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.eventHistory = []
  }

  /**
   * Get handler count for event type
   */
  getHandlerCount(eventType: EventType): number {
    return this.handlers.get(eventType)?.size || 0
  }

  /**
   * Get all subscribed event types
   */
  getSubscribedEvents(): EventType[] {
    return Array.from(this.handlers.keys()).filter(
      (type) => (this.handlers.get(type)?.size || 0) > 0,
    )
  }
}
