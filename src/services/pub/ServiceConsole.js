var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ServiceClient from "./ServiceClient.js";
import readline from "readline";
import * as fs from "fs/promises";
import { WebSocket } from "ws";
import { WebSocketMessenger } from "../../network/index.js";
import { SyncMessenger } from "../../messaging/index.js";
/**
 * A CLI client for a service that can be accessed via a ServiceClient.
 */
export class ServiceConsole {
    constructor(bindings) {
        this.bindings = bindings;
    }
    initialize(configPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = JSON.parse(yield fs.readFile(configPath, 'utf-8'));
            if (config.protocol === "webSocket") {
                const socket = new WebSocket(config.serviceAddress);
                const messenger = new WebSocketMessenger(socket);
                yield messenger.initialize();
                const syncMessenger = new SyncMessenger(messenger);
                this.client = new ServiceClient(syncMessenger, config.clientId, config.serviceId);
                this.client.initialize();
            }
            else {
                throw new Error("Local services not currently supported");
            }
            // Set up readline interface for listening to console input
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                prompt: '> '
            });
            rl.prompt();
            rl.on('line', (line) => __awaiter(this, void 0, void 0, function* () {
                if (line.trim()) {
                    yield this.executeLine(line.trim());
                }
                rl.prompt();
            }));
            rl.on('close', () => {
                process.exit(0);
            });
        });
    }
    executeLine(line) {
        return __awaiter(this, void 0, void 0, function* () {
            const [command, ...args] = line.split(" ");
            if (!this.bindings[command]) {
                console.error(`Unknown command: ${command}`);
                return;
            }
            if (!(yield this._checkArguments(command, args))) {
                console.error(`Invalid arguments for command: ${command}`);
                console.error(`Expected: ${this.bindings[command].join(", ")}`);
                return;
            }
            try {
                const parsedArgs = yield this._parseArguments(command, args);
                const result = yield this.client.call(command, parsedArgs);
                this._printResult(result);
            }
            catch (error) {
                console.error(`Error executing command: ${error}`);
            }
        });
    }
    _checkArguments(command, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const expectedTypes = this.bindings[command];
            if (!expectedTypes) {
                return false;
            }
            if (args.length !== expectedTypes.length) {
                return false;
            }
            // Check each argument matches its expected type
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                const expectedType = expectedTypes[i];
                switch (expectedType) {
                    case "boolean":
                        if (arg.toLowerCase() !== "true" && arg.toLowerCase() !== "false") {
                            return false;
                        }
                        break;
                    case "number":
                        if (isNaN(parseFloat(arg)) || !isFinite(parseFloat(arg))) {
                            return false;
                        }
                        break;
                    case "string":
                        // Strings are always valid
                        break;
                    case "json":
                        try {
                            const parts = arg.split(".json");
                            // If the argument is the path of a json file
                            if (parts.length === 2 && parts[parts.length - 1] === "") {
                                JSON.parse(yield fs.readFile(arg, "utf-8"));
                            }
                            else {
                                // The argument is a direct json object declaration
                                JSON.parse(arg);
                            }
                        }
                        catch (e) {
                            return false;
                        }
                        break;
                    default:
                        return false;
                }
            }
            return true;
        });
    }
    _parseArguments(command, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const expectedTypes = this.bindings[command];
            return Promise.all(args.map((arg, index) => __awaiter(this, void 0, void 0, function* () {
                const type = expectedTypes[index];
                switch (type) {
                    case "boolean":
                        return arg.toLowerCase() === "true";
                    case "number":
                        return parseFloat(arg);
                    case "string":
                        return arg;
                    case "json":
                        const parts = arg.split(".json");
                        // If the argument is the path of a json file
                        if (parts.length === 2 && parts[parts.length - 1] === "") {
                            return JSON.parse(yield fs.readFile(arg, "utf-8"));
                        }
                        else {
                            // The argument is a direct json object declaration
                            return JSON.parse(arg);
                        }
                    default:
                        return arg;
                }
            })));
        });
    }
    _printResult(result) {
        if (result === null || result === undefined) {
            console.log("(no result)");
            return;
        }
        if (Array.isArray(result) && result.length > 0 && typeof result[0] === "object" &&
            this._isShallowObject(result[0])) {
            // Print as table
            const columns = Object.keys(result[0]);
            console.log(columns.join("\t"));
            result.forEach((row) => {
                console.log(columns.map(col => (![undefined, null].includes(row[col]) ? row[col].toString() : "undefined")).join("\t"));
            });
        }
        else if (typeof result === "object") {
            console.log(JSON.stringify(result, null, 2));
        }
        else {
            console.log(result);
        }
    }
    _isShallowObject(obj) {
        return (Object.keys(obj).findIndex((k) => typeof obj[k] === "object" && obj[k] !== null)) === -1;
    }
}
//# sourceMappingURL=ServiceConsole.js.map