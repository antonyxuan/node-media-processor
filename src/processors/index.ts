import path from 'path'

function load(recorderName: string) {
    try {
        const recoderPath = path.resolve(__dirname, recorderName)
        return require(recoderPath)
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND') {
            throw new Error(`No such recorder found: ${recorderName}`)
        }

        throw err
    }
}

export default { load }
