module.exports = (options: {
    sampleRate: any;
    channels: any;
    endOnSilence: any;
    thresholdStart: any;
    threshold: string;
    silence: any;
    thresholdEnd: any;
    device?: any;
    inputType: any;
    input: any;
    outputType: any;
    output: any;
}) => {
    const cmd = 'sox'

    let args = [
        '--no-show-progress',
        '--rate', options.sampleRate,
        '--channels', options.channels,
        '--encoding', 'signed-integer',
        '--bits', '16',
        '--type', options.inputType,
        options.input,
        '--type', options.outputType,
        options.output
    ]

    if (options.endOnSilence) {
        args = args.concat([
            'silence', '0',
            '1', options.silence, options.thresholdEnd || options.threshold + '%'
        ])
    }

    const spawnOptions: any = {}

    if (options.device) {
        spawnOptions.env = { ...process.env, AUDIODEV: options.device }
    }

    return { cmd, args, spawnOptions }
}
