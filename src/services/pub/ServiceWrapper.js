var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from "fs/promises";
import { MessagePipe, MessengerClass } from "../../messaging/index.js";
import { WebSocketServer } from "../../network/index.js";
/**
 * Base class providing common integration code around IServices.
 * For example, code for establishing a WebSocket server, through
 * which the IService class can be accessed.
 */
export class ServiceWrapper {
    constructor(_service, _isServer = false, _serverProtocol = "local") {
        this._service = _service;
        this._isServer = _isServer;
        this._serverProtocol = _serverProtocol;
    }
    initialize(configPath) {
        return __awaiter(this, void 0, void 0, function* () {
            this._config = JSON.parse(yield fs.readFile(configPath, 'utf-8'));
            yield this._service.initialize(this._config.serviceConfig);
            if (this._isServer) {
                if (this._serverProtocol === "webSocket") {
                    const server = new WebSocketServer({ port: this._config.serverPort });
                    this._serviceMessenger = new MessengerClass(this._service, undefined, this._config.id);
                    this._messagePipe = new MessagePipe(server, this._serviceMessenger);
                    this._messagePipe.join();
                }
            }
        });
    }
}
//# sourceMappingURL=ServiceWrapper.js.map