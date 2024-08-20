export declare class AudioProcessor {
    private options;
    private cmd;
    private args;
    private cmdOptions;
    private process;
    private _stream;
    constructor(options?: {});
    start(): this;
    stop(): void;
    pause(): void;
    resume(): void;
    isPaused(): boolean;
    stream(): NodeJS.ReadableStream;
}
