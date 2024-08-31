"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customAPIError = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
const customAPIError = (message, statusCode) => {
    return new CustomError(message, statusCode);
};
exports.customAPIError = customAPIError;
exports.default = CustomError;
