import dispachito from './index';

beforeEach(() => jest.resetAllMocks());

describe('dispachito() should', () => {
  const eventMock = jest.fn((causes, payload) => payload);
  const effectMock = jest.fn((args) => args);
  const causeMock = jest.fn();

  test('fire a single event', () => {
    const d = dispachito();
    d.event(function anEventName() {
      eventMock();
      return {};
    });

    d.dispatch('anEventName');

    expect(eventMock).toHaveBeenCalledTimes(1);
  });

  test('fire a single event with payload', () => {
    const d = dispachito();
    d.event(function anEventName(_, payload) {
      eventMock(_, payload);
      return {};
    });

    d.dispatch('anEventName', 'foobar payload');

    expect(eventMock).toHaveBeenCalledWith({}, 'foobar payload');
  });

  test('fire many events registered to a single id', () => {
    const d = dispachito();
    function anEventName() {
      eventMock();
      return {};
    }
    d.event(anEventName);
    d.event(anEventName);

    d.dispatch('anEventName');

    expect(eventMock).toHaveBeenCalledTimes(2);
  });

  test('fire an event that causes a side effect', () => {
    const d = dispachito();
    d.effect(function anEffectName(args) {
      effectMock(args);
    });
    d.event(function anEventThatCausesAnEffect() {
      return {
        anEffectName: null,
      };
    });

    d.dispatch('anEventThatCausesAnEffect');

    expect(effectMock).toHaveBeenCalledTimes(1);
  });

  test('fire an event that causes a side effect with arguments', () => {
    const d = dispachito();
    d.effect(function anEffectName(args) {
      effectMock(args);
    });
    d.event(function anEventThatCausesAnEffectWithArguments() {
      return {
        anEffectName: 'effect arguments',
      };
    });

    d.dispatch('anEventThatCausesAnEffectWithArguments');

    expect(effectMock).toHaveBeenCalledWith('effect arguments');
  });

  test('fire an event that causes many side effects', () => {
    const d = dispachito();
    d.effect(function anEffectName(args) {
      effectMock(args);
    });
    d.effect(function anotherEffect(args) {
      effectMock(args);
    });
    d.event(function anEventThatCausesAnEffectWithArguments() {
      return {
        anEffectName: 'effect arguments',
        anotherEffect: { foo: 123 },
      };
    });

    d.dispatch('anEventThatCausesAnEffectWithArguments');

    expect(effectMock).toHaveBeenCalledWith('effect arguments');
    expect(effectMock).toHaveBeenCalledWith({ foo: 123 });
  });

  test('fire an event that needs a side cause', () => {
    const d = dispachito();
    const spyEvent = jest.fn();
    d.cause(function aSideCause() {
      causeMock();
      return 'side-cause-value';
    });
    d.event(function anEventWithSideCauses({ aSideCause }) {
      spyEvent(aSideCause);
      return {};
    });

    d.dispatch('anEventWithSideCauses');

    expect(causeMock).toHaveBeenCalled();
    expect(spyEvent).toHaveBeenCalledWith('side-cause-value');
  });

  test('fire an event that needs many side causes', () => {
    const d = dispachito();
    const spyEvent = jest.fn();
    d.cause(function aSideCause() {
      causeMock();
      return 'side-cause-value';
    });
    d.cause(function anotherSideCause() {
      causeMock();
      return 'another-side-cause-value';
    });
    d.event(function anEventWithSideCauses({ aSideCause, anotherSideCause }) {
      spyEvent(aSideCause, anotherSideCause);
      return {};
    });

    d.dispatch('anEventWithSideCauses');

    expect(causeMock).toHaveBeenCalled();
    expect(spyEvent).toHaveBeenCalledWith(
      'side-cause-value',
      'another-side-cause-value'
    );
  });

  test('throw an error when dispatching an unregistered event', () => {
    const d = dispachito();

    expect(() => {
      d.dispatch('unregisteredEventName');
    }).toThrow(Error('Unregistered event id: unregisteredEventName'));
  });
});
