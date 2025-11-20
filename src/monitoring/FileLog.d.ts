/**
 * A file-based log with 2 rotating files, to provide
 * efficient self-removal of old logs.
 */
export default class FileLog {
    private _directory;
    private _baseFileName;
    private _maxSize;
    private _currentFile;
    private _initialized;
    constructor(_directory: string, _baseFileName: string, maxSizeInBytes?: number);
    private initialize;
    private getFilePath;
    private getOtherFileNumber;
    private getCurrentFileSize;
    private rotateFiles;
    log(message: string): Promise<void>;
}
