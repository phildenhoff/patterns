export type CachableStats = {
  cacheHitRatio: number,
  cacheMissRatio: number,
  cacheHits: number,
  cacheMisses: number,
  numFlyweights: number
};

export const createFlyweight = <
  Cacheable,
  CachableConstructor extends (...args: any) => Cacheable
>(
  createCachable: CachableConstructor,
  flyweightableIsEqual: (
    a: Cacheable,
    b: Parameters<CachableConstructor>
  ) => boolean
): [
  (...args: Parameters<CachableConstructor>) => Readonly<Cacheable>,
  () => Cacheable[],
  () => CachableStats
] => {
  const flyweights = new Set<Cacheable>();
  let cacheHits = 0;
  let cacheMisses = 0;

  return [
    (...args: Parameters<CachableConstructor>) => {
      const flyweight = Array.from(flyweights).find((f) =>
        flyweightableIsEqual(f, args)
      );

      if (flyweight) {
        cacheHits++;
        return flyweight;
      }
      cacheMisses++;

      const newFlyweight = createCachable.apply(undefined, args);
      flyweights.add(newFlyweight);

      return Object.freeze(newFlyweight);
    },
    () => [...flyweights],
    () => ({
      cacheHits: cacheHits,
      cacheMisses: cacheMisses,
      cacheHitRatio : cacheHits / (cacheHits + cacheMisses),
      cacheMissRatio: cacheMisses / (cacheHits + cacheMisses),
      numFlyweights: flyweights.size
    }),
  ];
};
