var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class EventEmitter {
    allowAllEvents() {
        return this._allowAllEvents;
    }
    setAllowAllEvents(allowAllEvents) {
        this._allowAllEvents = allowAllEvents;
    }
    _onEvent(event, callback) {
        if (this._allowAllEvents || this._allowedEvents.includes(event)) {
            this._eventListeners.push({
                event: event,
                callback: callback
            });
        }
    }
    _eventsFromEventString(eventsString) {
        return eventsString.split(" ").join("").split(",");
    }
    constructor() {
        this._eventListeners = [];
        this._allowedEvents = [];
        this._allowAllEvents = true;
    }
    on(eventsString, callback) {
        var events = this._eventsFromEventString(eventsString);
        for (var i = 0; i < events.length; i++) {
            this._onEvent(events[i], callback);
        }
    }
    off(event, callback) {
        for (var i = this._eventListeners.length - 1; i >= 0; i--) {
            if (this._eventListeners[i].event === event
                &&
                    this._eventListeners[i].callback === callback) {
                this._eventListeners.splice(i, 1);
            }
        }
    }
    trigger(event, args) {
        if (args === undefined)
            args = [];
        for (var i = 0; i < this._eventListeners.length; i++) {
            if (this._eventListeners[i].event === event) {
                this._eventListeners[i].callback(...args);
            }
        }
    }
    triggerAwait(event, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args === undefined)
                args = [];
            for (var i = 0; i < this._eventListeners.length; i++) {
                if (this._eventListeners[i].event === event) {
                    yield this._eventListeners[i].callback(...args);
                }
            }
        });
    }
    allowedEvents() {
        return this._allowedEvents;
    }
    setAllowedEvents(allowedEvents) {
        this._allowedEvents = allowedEvents;
    }
    addAllowedEvent(event) {
        if (!this._allowedEvents.includes(event))
            this._allowedEvents.push(event);
    }
    removeAllowedEvent(event) {
        if (this._allowedEvents.includes(event))
            this._allowedEvents.splice(this._allowedEvents.indexOf(event), 1);
    }
}
//# sourceMappingURL=EventEmitter.js.map