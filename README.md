Dispachito
===========

A javascript event dispatcher with flow, a lot of flow.

## Usage
```javascript
// just a logger function
let logger = e => console.log(e);

// instance dispachito
let d = dispachito();

// subscribe logger
d.on('event:id', logger);

// dispatch an event
d.dispatch('event:id', 'string to log')

// unsubscribe logger
d.off('event:id', logger)
```

