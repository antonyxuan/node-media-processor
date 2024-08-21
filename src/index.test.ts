import { AudioProcessor } from './index';
import { ChildProcess } from 'node:child_process';
import processors from './processors';

// Mock the processors module
jest.mock('./processors', () => ({
    load: jest.fn(),
}));

// Mock the child_process module
jest.mock('node:child_process', () => ({
    spawn: jest.fn(),
}));

describe('AudioProcessor', () => {
    let audioProcessor: AudioProcessor;

    beforeEach(() => {
        // Reset mocks before each test
        jest.resetAllMocks();

        // Create a new instance of AudioProcessor with default options
        audioProcessor = new AudioProcessor();
    });

    test('should initialize with default options', () => {
        expect(audioProcessor).toBeDefined();
        expect(processors.load).toHaveBeenCalledWith('sox');
    });

    test('should override default options with provided options', () => {
        const options = {
            sampleRate: 44100,
            channels: 2,
            processor: 'ffmpeg',
        };

        audioProcessor = new AudioProcessor(options);

        expect(audioProcessor).toBeDefined();
        expect(processors.load).toHaveBeenCalledWith('ffmpeg');
        expect(audioProcessor['options'].sampleRate).toBe(44100);
        expect(audioProcessor['options'].channels).toBe(2);
    });

    // Add more tests to cover other functionalities
});