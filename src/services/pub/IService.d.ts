import type { DMessage } from "../../messaging/pub/DMessage.d.ts";
import ProxyMessenger from "../../messaging/pub/ProxyMessenger.js";
/**
 * Common interface for all service classes.
 * A service class is a class containing
 * the operations and state of a service / actor / microservice.
 */
export default interface IService {
    /**
     * A unique id of the service instance. This is used for contacting
     * the service by name from other services.
     */
    id: string;
    /**
     * An IMessenger with which the IService can communicate to the outside
     * world, to contact other services or to send global events.
     * This is optional because not all services wish to engage other services by name.
     */
    proxyMessenger?: ProxyMessenger<DMessage, DMessage>;
    /**
     * The names of the events that the IService can trigger for those
     * that have subscribed to them. The keys are the names of the listener
     * methods and the values are the names of the triggered events.
     */
    outEvents?: {
        [listenerMethod: string]: string;
    };
    /**
     * Handler functions for incoming events from other services.
     * The keys are the names of the events and the values are the
     * event handler functions/methods.
     */
    eventHandlers?: {
        [event: string]: (...args: unknown[]) => unknown;
    };
    /**
     * Initialize the service. After calling this it is ready for use.
     */
    initialize(...args: unknown[]): Promise<unknown>;
}
