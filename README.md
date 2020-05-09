# :notes: Dispachito

A javascript event dispatcher with flow, a lot of flow.

## Usage

```javascript
import dispachito from 'dispachito';

// side effect function
const log = (e) => console.log(e);
// side cause function
const now = () => Date.now();

// instance dispachito
const d = dispachito();

// register your side effects and side causes
d.effect(log);
d.cause(now);

// register your pure events
d.event(function whatTimeIsIt({ now }, payload) {
  return {
    log: payload + now,
  };
});

d.dispatch('whatTimeIsIt', 'Current time is: ');
// result: Current time is: 1588975886908
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
