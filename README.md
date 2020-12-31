# :notes: Dispachito

A javascript event dispatcher with flow, a lot of flow.

## Usage

```javascript
import dispachito from 'dispachito';

// instance dispachito
const { event, with, effect, dispatch } = dispachito();

function currentTime() {
  return { currentTime: Date.now() };
}

cause(currentTime);
effect(console.log);

const e = event(
  'whatTimeIsIt',
  function whatTimeIsIt({ now }, payload) {
    return {
      log: payload + now,
    };
  }),
);

e.with(currentTime);
e.describe();
e.dispatch();

dispatch('whatTimeIsIt', 'Current time is: ');
// result: Current time is: 1588975886908
```

```javascript
import { whatTimeIsIt } from './events';

test('test event example', () => {
  const now = () => 1234;
  const event = whatTimeIsIt().with(now);

  const effect = event.describe('Current time: ');

  expect(effect).toEqual({
    log: 'Current time: 1234421312',
  });
});

test('test event example', () => {
  const now = () => ({ now: 1234421312 });
  const event = whatTimeIsIt({ now }, 'Current time is: ');

  const effect = event.describe();

  expect(effect).toEqual({
    log: 'Current time is: 1234421312',
  });
});
```

## Usage with store

Setup your dispachito instance:

```javascript
import dispachito, { withStore } from 'dispachito';

const d = withStore(dispachito(), { counter: 0 });

d.event(function increment({ state, now }, payload) {
  return {
    state: {
      counter: state.counter + 1,
    },
    // another side effect
    log: payload + now,
  };
});

export default d;
```

And then in the view side:

```javascript
import React from 'react';
import { render } from 'react-dom';
import { Subscribe, connect } from 'dispachito/react';
import d from './setup';

const StateAwareCounter = connect(
  function mapToProps(state) {
    return {
      count: state.counter,
    };
  },
  function dispatchToProps(dispatch) {
    return {
      increment: () => dispatch('increment'),
    };
  }
)(function Counter({ count, increment }) {
  return (
    <>
      <button onCLick={increment}>Increase</button>
      <div>Current count: {count}</div>
    </>
  );
});

ReactDOM.render(
  <Subscribe store={d}>
    <StateAwareCounter />
  </Subscribe>,
  document.querySelector('#root')
);
```
