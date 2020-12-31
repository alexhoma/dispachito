import dispachito from './index';

beforeEach(() => jest.resetAllMocks());

describe('dispachito() should', () => {
  let d;
  const eventMock = jest.fn((causes, payload) => payload);
  const effectMock = jest.fn((args) => args);
  const causeMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    d = dispachito();
  });

  test('fire a single event', () => {
    d.event('eventId', () => {
      eventMock();
      return {};
    });

    d.dispatch('eventId');

    expect(eventMock).toHaveBeenCalledTimes(1);
  });

  test('fire a single event with payload', () => {
    d.event('eventId', (_, payload) => {
      eventMock(_, payload);
      return {};
    });

    d.dispatch('eventId', 'foobar payload');

    expect(eventMock).toHaveBeenCalledWith({}, 'foobar payload');
  });

  test('fire many events registered to a single id', () => {
    d.event('anEventId', function aHandler() {
      eventMock();
      return {};
    });
    d.event('anEventId', function anotherHandler() {
      eventMock();
      return {};
    });

    d.dispatch('anEventId');

    expect(eventMock).toHaveBeenCalledTimes(2);
  });

  test('fire an event that causes a side effect', () => {
    d.effect('anEffectId', effectMock);
    d.event('anEventThatCausesAnEffect', () => {
      return {
        anEffectId: null,
      };
    });

    d.dispatch('anEventThatCausesAnEffect');

    expect(effectMock).toHaveBeenCalledTimes(1);
  });

  test('fire an event that causes a side effect with arguments', () => {
    d.effect('anEffectId', effectMock);
    d.event('anEventThatCausesAnEffectWithArguments', () => {
      return {
        anEffectId: 'effect arguments',
      };
    });

    d.dispatch('anEventThatCausesAnEffectWithArguments');

    expect(effectMock).toHaveBeenCalledWith('effect arguments');
  });

  test('fire an event that causes many side effects', () => {
    d.effect('anEffectId', effectMock);
    d.effect('anotherEffectId', effectMock);
    d.event('anEventThatCausesAnEffectWithArguments', () => {
      return {
        anEffectId: 'effect arguments',
        anotherEffectId: { foo: 123 },
      };
    });

    d.dispatch('anEventThatCausesAnEffectWithArguments');

    expect(effectMock).toHaveBeenCalledWith('effect arguments');
    expect(effectMock).toHaveBeenCalledWith({ foo: 123 });
  });

  test('fire an event that needs a side cause', () => {
    const spyEvent = jest.fn();
    d.cause('aSideCauseId', () => {
      causeMock();
      return 'side-cause-value';
    });
    d.event(
      'anEventWithSideCauses',
      ({ aSideCauseId }) => {
        spyEvent(aSideCauseId);
        return {};
      },
      ['aSideCauseId']
    );

    d.dispatch('anEventWithSideCauses');

    expect(causeMock).toHaveBeenCalled();
    expect(spyEvent).toHaveBeenCalledWith('side-cause-value');
  });

  // test('fire an event that needs many side causes', () => {
  //   const spyEvent = jest.fn();
  //   d.cause('aSideCauseId', () => {
  //     causeMock();
  //     return 'side-cause-value';
  //   });
  //   d.cause('anotherSideCauseId', () => {
  //     causeMock();
  //     return 'side-cause-value';
  //   });
  //   d.event(
  //     'anEventWithSideCauses',
  //     d.with(
  //       ['aSideCauseId', 'notherSideCauseId'],
  //       ({ aSideCauseId, anotherSideCauseId }) => {
  //         spyEvent(aSideCauseId, anotherSideCauseId);
  //         return {};
  //       }
  //     )
  //   );

  //   d.dispatch('anEventWithSideCauses');

  //   expect(causeMock).toHaveBeenCalled();
  //   expect(spyEvent).toHaveBeenCalledWith(
  //     'side-cause-value',
  //     'another-side-cause-value'
  //   );
  // });

  test('throw an error when dispatching an unregistered event', () => {
    expect(() => {
      d.dispatch('unregisteredEventName');
    }).toThrow(Error('Unregistered event id: unregisteredEventName'));
  });
});
