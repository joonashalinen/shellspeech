export default class EventEmitter {
    _eventListeners: Array<{
        [prop: string]: any;
    }>;
    _allowedEvents: Array<string>;
    _allowAllEvents: boolean;
    allowAllEvents(): boolean;
    setAllowAllEvents(allowAllEvents: boolean): void;
    _onEvent(event: string, callback: Function): void;
    _eventsFromEventString(eventsString: string): string[];
    constructor();
    on(eventsString: string, callback: Function): void;
    off(event: string, callback: Function): void;
    trigger(event: string, args?: Array<any>): void;
    triggerAwait(event: string, args?: Array<any>): Promise<any>;
    allowedEvents(): Array<string>;
    setAllowedEvents(allowedEvents: Array<string>): void;
    addAllowedEvent(event: string): void;
    removeAllowedEvent(event: string): void;
}
