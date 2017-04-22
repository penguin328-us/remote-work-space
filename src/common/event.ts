export interface IEvent<T> {
    on(handler: (eventArg?: T) => void): void;
    off(handler: (eventArg?: T) => void): void;
}

export class Event<T> implements IEvent<T>{
    private handlers: { (eventArg?: T): void; }[] = [];

    public on(handler: (eventArg?: T) => void): void {
        this.handlers.push(handler);
    }

    public off(handler: (eventArg?: T) => void): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(eventArg?: T): void {
        this.handlers.forEach(h => h(eventArg))
    }
}