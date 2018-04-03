type EventHandler = (event: any) => void;
type EventHandlerDictionary = {
    [id: string]: Array<EventHandler>
}

/**
 * Dispachito entry point
 *
 * @returns {dispachito}
 */
export function dispachito() {
    let events: EventHandlerDictionary = Object.create(null);

    /**
     * Subscribe an event
     *
     * @param {string} id
     * @param {EventHandler} event
     */
    function on(id: string, event: EventHandler): void {
        events[id]
            ? events[id].push(event)
            : (events[id] = []).push(event)
    }

    /**
     * Unsubscribe an event
     *
     * @param {string} id
     * @param {EventHandler} event
     */
    function off(id: string, event: EventHandler): void {
        if (events[id]) {
            events[id].splice(
                events[id].indexOf(event),
                1
            )
        }
    }

    /**
     * Dispatch an event with data
     *
     * @param {string} id
     * @param data
     */
    function dispatch(id: string, data: any): void {
        events[id]
            ? events[id].map(event => event(data))
            : null
    }

    return {on, off, dispatch}
}