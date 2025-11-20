var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from 'fs/promises';
import * as path from 'path';
/**
 * A file-based log with 2 rotating files, to provide
 * efficient self-removal of old logs.
 */
export default class FileLog {
    constructor(_directory, _baseFileName, maxSizeInBytes = 1024 * 1024 // Default 1MB
    ) {
        this._directory = _directory;
        this._baseFileName = _baseFileName;
        this._currentFile = 1;
        this._initialized = false;
        this._maxSize = maxSizeInBytes;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._initialized)
                return;
            // Ensure directory exists
            yield fs.mkdir(this._directory, { recursive: true });
            // Determine which file to use by checking existing files
            const file1Path = this.getFilePath(1);
            const file2Path = this.getFilePath(2);
            try {
                const [stat1, stat2] = yield Promise.all([
                    fs.stat(file1Path).catch(() => null),
                    fs.stat(file2Path).catch(() => null)
                ]);
                if (!stat1 && !stat2) {
                    // No files exist, start with file 1
                    this._currentFile = 1;
                }
                else if (!stat1) {
                    // Only file 2 exists
                    this._currentFile = 2;
                }
                else if (!stat2) {
                    // Only file 1 exists
                    this._currentFile = 1;
                }
                else {
                    // Both exist, use the newer one based on modification time
                    this._currentFile = stat2.mtime > stat1.mtime ? 2 : 1;
                }
            }
            catch (error) {
                // If error occurs, default to file 1
                this._currentFile = 1;
            }
            this._initialized = true;
        });
    }
    getFilePath(fileNumber) {
        return path.join(this._directory, `${this._baseFileName}.${fileNumber}.log`);
    }
    getOtherFileNumber() {
        return this._currentFile === 1 ? 2 : 1;
    }
    getCurrentFileSize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stat = yield fs.stat(this.getFilePath(this._currentFile));
                return stat.size;
            }
            catch (_a) {
                return 0;
            }
        });
    }
    rotateFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const otherFile = this.getOtherFileNumber();
            const otherFilePath = this.getFilePath(otherFile);
            // Delete the other file if it exists
            try {
                yield fs.unlink(otherFilePath);
            }
            catch (_a) {
                // File might not exist, that's fine
            }
            // Switch to the other file
            this._currentFile = otherFile;
        });
    }
    log(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initialize();
            const timestamp = new Date().toISOString();
            const logEntry = `[${timestamp}] ${message}\n`;
            const currentSize = yield this.getCurrentFileSize();
            const halfMaxSize = this._maxSize / 2;
            // Check if we need to rotate
            if (currentSize + Buffer.byteLength(logEntry, 'utf8') > halfMaxSize) {
                yield this.rotateFiles();
            }
            // Append to current file
            yield fs.appendFile(this.getFilePath(this._currentFile), logEntry, 'utf8');
        });
    }
}
//# sourceMappingURL=FileLog.js.map