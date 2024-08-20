"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const node_console_1 = require("node:console");
const processors_1 = __importDefault(require("./processors"));
class AudioProcessor {
    constructor(options = {}) {
        const defaults = {
            sampleRate: 16000,
            channels: 1,
            compress: false,
            threshold: 0.5,
            thresholdStart: null,
            thresholdEnd: null,
            silence: '1.0',
            processor: 'sox',
            endOnSilence: false,
            audioType: 'waveaudio',
            input: '--default-device',
            output: '-p',
        };
        this.options = Object.assign(defaults, options);
        const processor = processors_1.default.load(this.options.processor);
        const { cmd, args, spawnOptions = {} } = processor(this.options);
        this.cmd = cmd;
        this.args = args;
        this.cmdOptions = Object.assign({ encoding: 'binary', stdio: 'pipe' }, spawnOptions);
        (0, node_console_1.debug)(`Started recording`);
        (0, node_console_1.debug)(this.options);
        (0, node_console_1.debug)(` ${this.cmd} ${this.args.join(' ')}`);
        return this.start();
    }
    start() {
        const { cmd, args } = this;
        const cp = (0, node_child_process_1.spawn)(cmd, args);
        const rec = cp.stdout;
        const err = cp.stderr;
        this.process = cp; // expose child process
        this._stream = rec; // expose output stream
        cp.on('close', code => {
            if (code === 0)
                return;
            rec.emit('error', `${this.cmd} has exited with error code ${code}.

Enable debugging with the environment variable DEBUG=record.`);
        });
        err.on('data', chunk => {
            (0, node_console_1.debug)(`STDERR: ${chunk}`);
        });
        rec.on('data', chunk => {
            (0, node_console_1.debug)(`Processing ${chunk.length} bytes`);
        });
        rec.on('end', () => {
            (0, node_console_1.debug)('Audio Processing ended');
        });
        return this;
    }
    stop() {
        this.process.kill();
    }
    pause() {
        this.process.kill('SIGSTOP');
        this._stream.pause();
        (0, node_console_1.debug)('Paused collecting audio');
    }
    resume() {
        this.process.kill('SIGCONT');
        this._stream.resume();
        (0, node_console_1.debug)('Resumed collecting audio');
    }
    isPaused() {
        return this._stream.isPaused();
    }
    stream() {
        return this._stream;
    }
}
let p = new AudioProcessor({ endOnSilence: true });
p.stream().on('data', chunk => {
    (0, node_console_1.debug)(`${chunk.length}`);
});
