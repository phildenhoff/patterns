import { DevProxy } from './proxy';

describe('Proxy', () => {
  it('should be transparent when provided no handlers', () => {
    const target = {
      field: 'value',
    };
    const handler = {};

    const proxy = DevProxy(target, handler);
    expect(proxy.field).toEqual('value');
  });

  it('should allow the handler to modify fields', () => {
    const target = {
      field: 'value',
    };
    const handler = {
      get: (target: Record<string, string>, name: string) => {
        return target[name].toUpperCase();
      },
    };

    const proxy = DevProxy(target, handler);
    expect(proxy.field).toEqual('VALUE');
  });
});
