export default function dispachito() {
  const events = {};
  const causes = {};
  const effects = {};

  function extractSideCausesData(sideCauseIds) {
    return sideCauseIds.reduce(
      (acc, id) => ({
        ...acc,
        [id]: causes[id](),
      }),
      {}
    );
  }

  function executeSideEffects(sideEffects) {
    Object.entries(sideEffects).forEach(([id, data]) =>
      effects[id] ? effects[id](data) : null
    );
  }

  return {
    effect(id, handler) {
      effects[id] = handler;
    },
    with(cause, handler) {
      causes[cause.name] = cause;
      return [handler, cause.name];
    },
    event(id, handler) {
      const definition =
        typeof handler === 'function' ? [handler, []] : handler;

      events[id]
        ? events[id].push(definition)
        : (events[id] = []).push(definition);

      return () => {};
    },
    dispatch(id, payload) {
      if (!events[id]) {
        throw new Error('Unregistered event id: ' + id);
      }

      events[id].map(function fire([event, causes]) {
        const sideCausesData = extractSideCausesData(causes);
        const sideEffects = event(sideCausesData, payload);
        executeSideEffects(sideEffects);
      });
    },
  };
}

// Possible store decoreator for dispachito
// function withStore(d, initial = {}) {
//   let storeState = initial;

//   d.effect(function state(mutations) {
//     storeState = Object.assign(storeState, mutations);
//   });

//   d.cause(function state() {
//     return storeState;
//   });

//   return Object.assign(d, {
//     getState() {
//       return storeState;
//     },
//   });
// }
