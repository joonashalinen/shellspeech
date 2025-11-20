var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Base implementation of IService.
 */
export default class Service {
    constructor(id) {
        this.id = id;
        this.log = console.log;
        this._initialized = false;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._initialized)
                return;
            this._initialized = true;
        });
    }
}
//# sourceMappingURL=Service.js.map