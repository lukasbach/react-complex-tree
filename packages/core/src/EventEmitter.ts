export interface EventEmitterOptions<EventPayload = any> {
  logger?: (log: string, payload?: EventPayload) => void;
}

export type EventHandler<EventPayload> =
  | ((payload: EventPayload) => Promise<void> | void)
  | null
  | undefined;

export class EventEmitter<EventPayload> {
  private handlerCount = 0;

  private handlers: Array<EventHandler<EventPayload>> = [];

  private options?: EventEmitterOptions<EventPayload>;

  constructor(options?: EventEmitterOptions<EventPayload>) {
    this.options = options;
  }

  public get numberOfHandlers() {
    return this.handlers.filter(h => !!h).length;
  }

  public async emit(payload: EventPayload): Promise<void> {
    const promises: Array<Promise<void>> = [];

    this.options?.logger?.('emit', payload);

    for (const handler of this.handlers) {
      if (handler) {
        const res = handler(payload) as Promise<void>;
        if (typeof res?.then === 'function') {
          promises.push(res);
        }
      }
    }

    await Promise.all(promises);
  }

  public on(handler: EventHandler<EventPayload>): number {
    this.options?.logger?.('on');
    this.handlers.push(handler);
    // eslint-disable-next-line no-plusplus
    return this.handlerCount++;
  }

  public off(handlerId: number) {
    this.delete(handlerId);
  }

  public delete(handlerId: number) {
    this.options?.logger?.('off');
    this.handlers[handlerId] = null;
  }
}
