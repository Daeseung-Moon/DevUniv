/* eslint-disable @typescript-eslint/no-explicit-any */

type EventListener<EVENT extends Event<T>, T> = (event: EVENT) => void | Promise<void>;

let sigleton: EventManager | null = null;

export function getEventManager() {
  if (!sigleton) {
    sigleton = new EventManager();
  }
  return sigleton;
}

export class Event<T = undefined> {
  detail: T;
  constructor(detail: T) {
    this.detail = detail;
  }
}

export class EventManager {
  private readonly _eventMap = new Map<
    new (...args: any[]) => Event<any>,
    EventListener<Event<any>, any>[]
  >();

  on<EVENT extends Event<T>, T>(
    eventType: new (...args: any[]) => EVENT,
    listener: EventListener<EVENT, T>,
  ) {
    if (!this._eventMap.has(eventType)) {
      this._eventMap.set(eventType, []);
    }
    const listeners = this._eventMap.get(eventType) as EventListener<EVENT, T>[];
    listeners.push(listener);
  }

  off<EVENT extends Event<T>, T>(
    eventType: new (...args: any[]) => EVENT,
    listener: EventListener<EVENT, T>,
  ) {
    const listeners = this._eventMap.get(eventType) as EventListener<EVENT, T>[];
    if (listeners) {
      listeners.splice(listeners.indexOf(listener), 1);
    }
  }

  async emit<EVENT extends Event<T>, T>(event: EVENT): Promise<void> {
    const listeners = this._eventMap.get(event.constructor as any) as EventListener<EVENT, T>[];
    if (listeners) {
      const promises = listeners.map((listener) => listener(event));
      await Promise.all(promises);
    }
  }

  /**
   * @todo: 참조할때마다 추가, 단 WeakMap이나 참조가 풀렸을때 callback함수로 삭제하는 로직 알아볼 것
   */
  ref() {
    throw new Error('Not implemented ref on EventManager');
  }

  /**
   * @todo: 아무도 참조하고 있지 않으면 삭제하는 로직 필요
   */
  unref() {
    throw new Error('Not implemented unref on EventManager');
  }
}
