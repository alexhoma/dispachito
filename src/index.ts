type EventHandler = (event: any) => void;
type EventHandlerMap = {
    [id: string]: Array<EventHandler>
}

module.exports = function dispachito() {
    let events: EventHandlerMap = Object.create(null);

    function on(id: string, event: EventHandler): void {
        events[id]
            ? events[id].push(event)
            : (events[id] = []).push(event)
    }

    function off(id: string, event: EventHandler): void {
        if (events[id]) {
            events[id].splice(
                events[id].indexOf(event)
            )
        }
    }

    function dispatch(id: string, data: any): void {
        events[id]
            ? events[id].map(event => event(data))
            : null
    }

    return {on, off, dispatch}
};