"use strict";
module.exports = (options) => {
    const cmd = 'sox';
    let args = [
        '--no-show-progress',
        '--rate', options.sampleRate,
        '--channels', options.channels,
        '--encoding', 'signed-integer',
        '--bits', '16',
        '--type', options.audioType,
        '--default-device',
        '-p'
    ];
    if (options.endOnSilence) {
        args = args.concat([
            'silence', '1', '0.1', options.thresholdStart || options.threshold + '%',
            '1', options.silence, options.thresholdEnd || options.threshold + '%'
        ]);
    }
    const spawnOptions = {};
    if (options.device) {
        spawnOptions.env = Object.assign(Object.assign({}, process.env), { AUDIODEV: options.device });
    }
    return { cmd, args, spawnOptions };
};
