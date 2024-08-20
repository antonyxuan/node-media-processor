import { spawn, ChildProcess } from 'node:child_process';
import { debug } from 'node:console';
import processors from './processors';

export class AudioProcessor {
    private options: any;
    private cmd: string;
    private args: string[];
    private cmdOptions: any;
    private process!: ChildProcess;
    private _stream!: NodeJS.ReadableStream;

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
        }

        this.options = Object.assign(defaults, options)

        const processor = processors.load(this.options.processor)
        const { cmd, args, spawnOptions = {} } = processor(this.options)

        this.cmd = cmd
        this.args = args
        this.cmdOptions = Object.assign({ encoding: 'binary', stdio: 'pipe' }, spawnOptions)

        debug(`Started recording`)
        debug(this.options)
        debug(` ${this.cmd} ${this.args.join(' ')}`)

        return this.start()
    }

    start() {
        const { cmd, args } = this

        const cp = spawn(cmd, args)
        const rec = cp.stdout
        const err = cp.stderr

        this.process = cp // expose child process
        this._stream = rec // expose output stream

        cp.on('close', code => {
            if (code === 0) return
            rec.emit('error', `${this.cmd} has exited with error code ${code}.

Enable debugging with the environment variable DEBUG=record.`
            )
        })

        err.on('data', chunk => {
            debug(`STDERR: ${chunk}`)
        })

        rec.on('data', chunk => {
            debug(`Processing ${chunk.length} bytes`)
        })

        rec.on('end', () => {
            debug('Audio Processing ended')
        })

        return this;
    }

    stop() {
        this.process!.kill()
    }

    pause() {
        this.process!.kill('SIGSTOP')
        this._stream!.pause()
        debug('Paused collecting audio')
    }

    resume() {
        this.process!.kill('SIGCONT')
        this._stream!.resume()
        debug('Resumed collecting audio')
    }

    isPaused() {
        return this._stream!.isPaused()
    }

    stream() {
        return this._stream!
    }
}