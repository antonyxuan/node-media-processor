"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function load(recorderName) {
    try {
        const recoderPath = path_1.default.resolve(__dirname, recorderName);
        return require(recoderPath);
    }
    catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            throw new Error(`No such recorder found: ${recorderName}`);
        }
        throw err;
    }
}
exports.default = { load };
