type EventHandler = (event: any) => void;
type EventHandlerMap = {
    [id: string]: Array<EventHandler>
}

export function dispachito() {
    let events: EventHandlerMap = Object.create(null);

    function on(id: string, event: EventHandler): void {
        if (events[id]) {
            events[id].push(event)
        } else {
            events[id] = [];
            events[id].push(event)
        }
    }

    function off(id: string, event: EventHandler): void {
        // TODO: implement method
    }

    function dispatch(id: string, data: any): void {
        events[id]
            ? events[id].map(event => event(data))
            : null
    }

    return {on, off, dispatch}
}
