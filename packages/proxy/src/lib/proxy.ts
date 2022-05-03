export type DevProxyHandler<T> = {
  get?: <TProp extends keyof T>(target: T, name: TProp) => T[TProp];
};

export const DevProxy = <T extends object>(
  target: T,
  handler: DevProxyHandler<T>
): T => {
  const proxy = { ...target };
  (Object.keys(target) as (keyof typeof target)[]).forEach((key) => {
    Object.defineProperty(proxy, key, {
      get: () => (handler?.get ? handler?.get(target, key) : target[key]),
    });
  });

  return proxy;
};
