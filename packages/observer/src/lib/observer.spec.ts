import { createObserver } from './observer';

describe('createObserver', () => {
  it('must provide a function to subscribe and publish', () => {
    const observer = createObserver<number>();
    expect(typeof observer.subscribe).toEqual('function');
    expect(typeof observer.publish).toEqual('function');
  });

  it('must provide an unsubscribe function via subscribe', () => {
    const observer = createObserver<number>();
    const unsubscribe = observer.subscribe(() => undefined);
    expect(typeof unsubscribe).toEqual('function');
  });

  it('must call subscribers on publish', () => {
    const observer = createObserver<number>();
    const spy = jest.fn();
    observer.subscribe(spy);
    observer.publish(1);
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('must call subscribers in registration order', () => {
    const observer = createObserver<number>();
    const spy1 = jest.fn();
    const spy2 = jest.fn(() => expect(spy1.mock.calls.length).toEqual(1));

    observer.subscribe(spy1);
    observer.subscribe(spy2);
    observer.publish(1);
    expect(spy1).toHaveBeenCalledWith(1);
    expect(spy2).toHaveBeenCalledWith(1);
  });

  it('must not call subscribers out of registration order', () => {
    // This time, spy2 is registered first.
    const observer = createObserver<number>();
    const spy1 = jest.fn();
    const spy2 = jest.fn(() => expect(spy1.mock.calls.length).not.toEqual(1));

    observer.subscribe(spy2);
    observer.subscribe(spy1);
    observer.publish(1);
    expect(spy1).toHaveBeenCalledWith(1);
    expect(spy2).toHaveBeenCalledWith(1);
  });

  it('must not call subscribers after unsubscribe', () => {
    const observer = createObserver<number>();
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const unsubscribe = observer.subscribe(spy1);

    observer.subscribe(spy2);
    observer.publish(1);
    expect(spy1).toHaveBeenCalledWith(1);
    expect(spy2).toHaveBeenCalledWith(1);

    unsubscribe();
    observer.publish(2);
    expect(spy1).not.toHaveBeenCalledWith(2);
    expect(spy2).toHaveBeenCalledWith(2);
  });

  it('must not call double-subscribers more than once', () => {
    const observer = createObserver<number>();
    const spy = jest.fn();
    observer.subscribe(spy);
    observer.subscribe(spy);
    observer.publish(1);
    expect(spy).toHaveBeenCalledWith(1);
    expect(spy.mock.calls.length).toEqual(1);
  });
});

describe('Observeable type support', () => {
  it('must support objects', () => {
    const observer = createObserver<{ a: string }>();
    const spy = jest.fn();
    observer.subscribe(spy);
    observer.publish({ a: 'b' });
    expect(spy).toHaveBeenCalledWith({ a: 'b' });
  });

  it('must support Maps', () => {
    const observer = createObserver<Map<string, number>>();
    const spy = jest.fn();
    observer.subscribe(spy);
    observer.publish(new Map([['a', 1]]));
    expect(spy).toHaveBeenCalledWith(new Map([['a', 1]]));
  });

  it('must support strings', () => {
    const observer = createObserver<string>();
    const spy = jest.fn();
    observer.subscribe(spy);
    observer.publish('a');
    expect(spy).toHaveBeenCalledWith('a');
  });
});

describe('Observeable performance', () => {
  it('must be fast', () => {
    const observer = createObserver<number>();
    const firstSpy = jest.fn();
    observer.subscribe(firstSpy);

    for (let i = 0; i < 10000; i++) {
      const spy = jest.fn();
      observer.subscribe(spy);
    }
    observer.publish(1);
    expect(firstSpy).toHaveBeenCalled();
  });
});
