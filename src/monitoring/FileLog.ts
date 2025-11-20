import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * A file-based log with 2 rotating files, to provide
 * efficient self-removal of old logs.
 */
export default class FileLog {
    private _maxSize: number;
    private _currentFile: 1 | 2 = 1;
    private _initialized: boolean = false;

    constructor(
        private _directory: string,
        private _baseFileName: string,
        maxSizeInBytes: number = 1024 * 1024 // Default 1MB
    ) {
        this._maxSize = maxSizeInBytes;
    }

    private async initialize() {
        if (this._initialized) return;

        // Ensure directory exists
        await fs.mkdir(this._directory, { recursive: true });

        // Determine which file to use by checking existing files
        const file1Path = this.getFilePath(1);
        const file2Path = this.getFilePath(2);

        try {
            const [stat1, stat2] = await Promise.all([
                fs.stat(file1Path).catch(() => null),
                fs.stat(file2Path).catch(() => null)
            ]);

            if (!stat1 && !stat2) {
                // No files exist, start with file 1
                this._currentFile = 1;
            } else if (!stat1) {
                // Only file 2 exists
                this._currentFile = 2;
            } else if (!stat2) {
                // Only file 1 exists
                this._currentFile = 1;
            } else {
                // Both exist, use the newer one based on modification time
                this._currentFile = stat2.mtime > stat1.mtime ? 2 : 1;
            }
        } catch (error) {
            // If error occurs, default to file 1
            this._currentFile = 1;
        }

        this._initialized = true;
    }

    private getFilePath(fileNumber: 1 | 2): string {
        return path.join(this._directory, `${this._baseFileName}.${fileNumber}.log`);
    }

    private getOtherFileNumber(): 1 | 2 {
        return this._currentFile === 1 ? 2 : 1;
    }

    private async getCurrentFileSize(): Promise<number> {
        try {
            const stat = await fs.stat(this.getFilePath(this._currentFile));
            return stat.size;
        } catch {
            return 0;
        }
    }

    private async rotateFiles() {
        const otherFile = this.getOtherFileNumber();
        const otherFilePath = this.getFilePath(otherFile);

        // Delete the other file if it exists
        try {
            await fs.unlink(otherFilePath);
        } catch {
            // File might not exist, that's fine
        }

        // Switch to the other file
        this._currentFile = otherFile;
    }

    async log(message: string) {
        await this.initialize();

        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}\n`;

        const currentSize = await this.getCurrentFileSize();
        const halfMaxSize = this._maxSize / 2;

        // Check if we need to rotate
        if (currentSize + Buffer.byteLength(logEntry, 'utf8') > halfMaxSize) {
            await this.rotateFiles();
        }

        // Append to current file
        await fs.appendFile(this.getFilePath(this._currentFile), logEntry, 'utf8');
    }
}