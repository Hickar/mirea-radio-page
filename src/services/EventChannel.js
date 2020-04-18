// @ts-check

import { CallbacksPool } from "./CallbacksPool";

export class EventChannel {
  /**
   * @type {Map<string, CallbacksPool<any>>}
   */
  handlers = new Map();

  /**
   * @param {string} event
   * @param {(payload: any) => void} handler
   */
  subscribe = (event, handler) => {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new CallbacksPool());
    }

    const handlers = this.handlers.get(event);

    if (handlers) {
      handlers.add(handler);
    }

    return () => {
      this.unsubscribe(event, handler);
    };
  };

  /**
   * @param {string} event
   * @param {(payload: any) => void} handler
   */
  unsubscribe = (event, handler) => {
    const handlers = this.handlers.get(event);

    if (handlers) {
      handlers.delete(handler);
    }
  };

  /**
   * @param {string} event
   * @param {any} payload
   */
  publish = (event, payload) => {
    const handlers = this.handlers.get(event);

    if (handlers) {
      handlers.invoke(payload);
    }
  };
}
