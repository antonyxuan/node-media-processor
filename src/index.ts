import { spawn, ChildProcess } from 'node:child_process';
import createDebug from 'debug';
import processors from './processors';

export class AudioProcessor {
    private debug = createDebug('AudioProcessor');
    private options: any;
    private cmd: string;
    private args: string[];
    private cmdOptions: any;
    private process!: ChildProcess;
    private stream!: NodeJS.ReadableStream;

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
            inputType: 'waveaudio',
            input: '--default-device',
            outputType: 'wav',
            output: '-',
        }

        this.options = Object.assign(defaults, options)

        const processor = processors.load(this.options.processor)
        const { cmd, args, spawnOptions = {} } = processor(this.options)

        this.cmd = cmd
        this.args = args
        this.cmdOptions = Object.assign({ encoding: 'binary', stdio: 'pipe' }, spawnOptions)
    }

    start() {
        const { cmd, args } = this

        this.debug(`Started reading`)
        this.debug(this.options)
        this.debug(` ${this.cmd} ${this.args.join(' ')}`)

        const cp = spawn(cmd, args)
        const rec = cp.stdout
        const err = cp.stderr

        this.process = cp // expose child process
        this.stream = rec // expose output stream

        cp.on('close', code => {
            if (code === 0) return
            rec.emit('error', `${this.cmd} has exited with error code ${code}.

Enable debugging with the environment variable DEBUG=AudioProcessor.`
            )
        })

        err.on('data', chunk => {
            this.debug(`STDERR: ${chunk}`)
        })

        rec.on('data', chunk => {
            this.debug(`Processing ${chunk.length} bytes`)
        })

        rec.on('end', () => {
            this.debug('Audio Processing ended')
        })

        return this;
    }

    stop() {
        this.process!.kill()
    }

    pause() {
        this.process!.kill('SIGSTOP')
        this.stream!.pause()
        this.debug('Paused collecting audio')
    }

    resume() {
        this.process!.kill('SIGCONT')
        this.stream!.resume()
        this.debug('Resumed collecting audio')
    }

    isPaused() {
        return this.stream!.isPaused()
    }

    getStream() {
        return this.stream!
    }

    getProcess() {
        return this.process!
    }
}