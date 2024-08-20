# node-media-processor

provide as a utility tool for manipulate media files or streams. The origianl idea is copied from node-record-lpcm16.

The package was tested based on SoX 14.4.2, there could be a change on the command arguments between previous version.

## Installation

`npm i @antonyxuan/media-processor`

## Dependencies

Generally, running `npm install` should suffice.

This module requires you to install [SoX](http://sox.sourceforge.net) and it must be available in your `$PATH`.

### For Mac OS
`brew install sox`

### For most linux disto's
`sudo apt-get install sox libsox-fmt-all`

### For Windows
[download the binaries](http://sourceforge.net/projects/sox/files/latest/download)

## Options

```
sampleRate            : 16000   // audio sample rate
channels              : 1       // number of channels
threshold             : 0.5     // silence threshold (rec only)
endOnSilence          : false   // automatically end on silence (if supported)
thresholdStart        : null    // silence threshold to start recording, overrides threshold (rec only)
thresholdEnd          : null    // silence threshold to end recording, overrides threshold (rec only)
silence               : '1.0'   // seconds of silence before ending
recorder              : 'sox'   // Defaults to 'sox'
device                : null    // recording device (e.g.: 'plughw:1')
audioType             : 'waveaudio'  // audio type to record
input                 : '--default-device'  // either default device or a path to input file
output                : '-p'    // '-p' for process as stream, file path for save as a file.
```

## Usage

To be provided

## Porcessors

The following processors are included:

* sox

## Error handling

Some processor might be logging errors to `stderr` and throw an exit code.
You can catch early termination by adding an error event listener to the stream.

To debug the recorder see [debugging](#debugging) below.

```javascript
recording.stream()
  .on('error', err => {
    console.error('recorder threw an error:', err)
  })
  .pipe(file)
```