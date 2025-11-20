import type IService from "./IService.d.ts";
import { DMessage, MessagePipe, MessengerClass } from "../../messaging/index.js";
import FileLog from "../../monitoring/FileLog.js";
export interface IServiceWrapperConfig<IServiceConfig> {
    id: string;
    serverPort?: number;
    serviceConfig?: IServiceConfig;
    fileLog?: {
        directory: string;
        baseFileName: string;
        maxSize: number;
    };
}
export type IServerProtocol = "webSocket" | "local";
/**
 * Base class providing common integration code around IServices.
 * For example, code for establishing a WebSocket server, through
 * which the IService class can be accessed.
 */
export declare class ServiceWrapper<IServiceConfig> {
    protected _service: IService;
    protected _isServer: boolean;
    protected _serverProtocol: IServerProtocol;
    protected _messagePipe?: MessagePipe<DMessage, DMessage>;
    protected _serviceMessenger?: MessengerClass<IService>;
    protected _config: IServiceWrapperConfig<IServiceConfig>;
    protected _fileLog: FileLog;
    constructor(_service: IService, _isServer?: boolean, _serverProtocol?: IServerProtocol);
    initialize(configPath: string): Promise<void>;
}
