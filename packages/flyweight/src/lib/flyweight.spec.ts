import { createFlyweight } from './flyweight';

type TestClass = {
  name: string;
  id: number;
  color: string;
};

type TestClassConstructor = (
  name: string,
  id: number,
  color: string
) => TestClass;

const createTestClass: TestClassConstructor = (
  name: string,
  id: number,
  color: string
): TestClass => {
  return {
    name,
    id,
    color,
  };
};

const testClassIsEqual = (
  a: TestClass,
  b: Parameters<TestClassConstructor>
) => {
  if (b.length <= 0) return false;
  const [bName, bId, bColor] = b;
  return a.name === bName && a.id === bId && a.color === bColor;
};

describe('flyweight', () => {
  it('must only create one instance for equivalent objects', () => {
    const [fwCreateTestClass, getFlyweights] = createFlyweight(
      createTestClass,
      testClassIsEqual
    );
    fwCreateTestClass('test1', 1, 'red');
    fwCreateTestClass('test1', 1, 'red');
    fwCreateTestClass('test2', 2, 'blue');
    fwCreateTestClass('test2', 2, 'blue');
    expect(getFlyweights().length).toEqual(2);
  });

  it('must provide identical flyweights', () => {
    const [fwCreateTestClass] = createFlyweight(
      createTestClass,
      testClassIsEqual
    );
    const test1 = fwCreateTestClass('test1', 1, 'red');
    const test2 = fwCreateTestClass('test1', 1, 'red');
    expect(test1).toEqual(test2);
  });

  it('must return uneditable flyweights', () => {
    const [fwCreateTestClass] = createFlyweight(
      createTestClass,
      testClassIsEqual
    );
    const test1 = fwCreateTestClass('test1', 1, 'red');
    expect(() => {
      // @ts-ignore We want to test this error
      test1.name = 'test2';
    }).toThrow();

    expect(() => {
      // @ts-ignore We want to test this error
      Object.assign(test1, { id: 2 });
    }).toThrow();
  });
});

describe('Flyweight performance', () => {
  it('must be fast when reusing the same flyweight', async () => {
    const [fwCreateTestClass, getFlyweights] = createFlyweight(
      createTestClass,
      testClassIsEqual
    );
    for (let i = 0; i < 100000; i++) {
      fwCreateTestClass(`test`, 1, 'red');
    }
    expect(getFlyweights().length).toEqual(1);
  });

  it('must warn the caller when their are too many flyweights', async () => {
    const [fwCreateTestClass, getFlyweights, getStats] = createFlyweight(
      createTestClass,
      testClassIsEqual
    );
    // As the number of unique flyweights grows, the flyweight manager
    // grows slower and slower.
    for (let i = 0; i < 1000; i++) {
      fwCreateTestClass(`test${i}`, i, 'red');
    }
    expect(getFlyweights().length).toEqual(1000);
    const {cacheHitRatio, cacheMissRatio} = getStats();
    expect(cacheHitRatio).toBe(0);
    expect(cacheMissRatio).toBe(1);
  });
});
