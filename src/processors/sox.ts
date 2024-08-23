module.exports = (options: {
    sampleRate: any;
    channels: any;
    endOnSilence: any;
    thresholdStart: any;
    threshold: string;
    silence: any;
    thresholdEnd: any;
    device?: any;
    input: any;
    output: any;
}) => {
    const cmd = 'sox'

    const input = options.input ? options.input : '--type waveaudio --default-device';

    let args = [
        '--no-show-progress',
        '--rate', options.sampleRate,
        '--channels', options.channels,
        '--encoding', 'signed-integer',
        '--bits', '16',
        input,
        options.output
    ]

    if (options.endOnSilence) {
        args = args.concat([
            'silence', '1', '0.1', options.thresholdStart || options.threshold + '%',
            '1', options.silence, options.thresholdEnd || options.threshold + '%'
        ])
    }

    const spawnOptions: any = {}

    if (options.device) {
        spawnOptions.env = { ...process.env, AUDIODEV: options.device }
    }

    return { cmd, args, spawnOptions }
}
