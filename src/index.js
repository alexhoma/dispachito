export default function dispachito() {
  const events = {};
  const causes = {};
  const effects = {};

  function extractSideCauseIds(event) {
    const causes = event.toString().match(/function\s.*?\({([^}]*)\}/);

    return causes
      ? causes[1]
          .split(',')
          .filter(Boolean)
          .map((arg) => arg.replace(/\/\*.*\*\//, ''))
          .map((arg) => arg.replace(/(\r\n\t|\n|\r\t)/gm, '').trim())
      : [];
  }

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
    effect(effect) {
      effects[effect.name] = effect;
    },
    cause(cause) {
      causes[cause.name] = cause;
    },
    event(event) {
      events[event.name]
        ? events[event.name].push(event)
        : (events[event.name] = []).push(event);
    },
    dispatch(id, payload) {
      if (!events[id]) {
        throw new Error('Unregistered event id: ' + id);
      }

      events[id].map(function dispatchEvent(event) {
        const sideCauseIds = extractSideCauseIds(event);
        const sideCausesData = extractSideCausesData(sideCauseIds);
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
