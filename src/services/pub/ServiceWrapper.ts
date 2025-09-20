import * as fs from "fs/promises"
import type IService from "./IService.d.ts";
import { DMessage, MessagePipe, MessengerClass } from "../../messaging/index.js";
import { WebSocketServer } from "../../network/index.js";

export interface IServiceWrapperConfig<IServiceConfig> {
    id: string;
    serverPort?: number;
    serviceConfig?: IServiceConfig;
}

export type IServerProtocol = "webSocket" | "local";

/**
 * Base class providing common integration code around IServices.
 * For example, code for establishing a WebSocket server, through
 * which the IService class can be accessed.
 */
export class ServiceWrapper<IServiceConfig> {
    protected _messagePipe?: MessagePipe<DMessage, DMessage>;
    protected _serviceMessenger?: MessengerClass<IService>;
    protected _config: IServiceWrapperConfig<IServiceConfig>;

    constructor(protected _service: IService, protected _isServer: boolean = false,
        protected _serverProtocol: IServerProtocol = "local") {}

    async initialize(configPath: string) {
        this._config = JSON.parse(await fs.readFile(configPath, 'utf-8'));

        this._service.id = this._config.id;

        if (this._isServer) {
            if (this._serverProtocol === "webSocket") {
                const server = new WebSocketServer({port: this._config.serverPort});
                this._serviceMessenger = new MessengerClass(this._service, undefined, this._config.id);
                this._messagePipe = new MessagePipe(server, this._serviceMessenger);
                this._messagePipe.join();
            }
        }
    }
}