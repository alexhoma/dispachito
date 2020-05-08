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
// result: Current time is 102013213
```
