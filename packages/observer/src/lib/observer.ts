type UnsubscribeFunction = () => void;

type Observer<MessageType> = {
  subscribe: (cb: (msg: MessageType) => void) => UnsubscribeFunction;
  publish: (msg: MessageType) => void;
};

export const createObserver = <MessageType>(): Observer<MessageType> => {
  const subscribers: Set<(msg: MessageType) => void> = new Set();

  return {
    subscribe: (cb: (msg: MessageType) => void): (() => void) => {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },

    publish: (msg: MessageType): void => subscribers.forEach((cb) => cb(msg)),
  };
};
