type AbstractEventMap = { [eventName: string]: any };
type Listener<M extends AbstractEventMap, K extends string> = (
  event: M[K]
) => any;

export class EventListenerManager<M extends AbstractEventMap> {
  private handlers: { [eventName: string]: Listener<any, any>[] } = {};

  public addEventListener<K extends keyof M & string>(
    type: K,
    listener: Listener<M, K>
  ) {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }

    this.handlers[type].push(listener);
  }

  public removeEventListener<K extends keyof M & string>(
    type: K,
    listener: Listener<M, K>
  ) {
    const idx = this.handlers[type].indexOf(listener);
    if (idx >= 0) {
      this.handlers[type].splice(idx, 1);
    }
  }

  public emitEvent<K extends keyof M & string>(type: K, payload: M[K]) {
    for (const handler of this.handlers[type]) {
      handler(payload);
    }
  }
}
