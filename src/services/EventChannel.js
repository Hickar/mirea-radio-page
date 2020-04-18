import { CallbacksPool } from "./CallbacksPool";

export class EventChannel {
  handlers = new Map();

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

  unsubscribe = (event, handler) => {
    const handlers = this.handlers.get(event);

    if (handlers) {
      handlers.delete(handler);
    }
  };

  publish = (event, payload) => {
    const handlers = this.handlers.get(event);

    if (handlers) {
      handlers.invoke(payload);
    }
  };
}
