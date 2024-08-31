"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("./customError"));
const defaultErrorHandler = (err, req, res, next) => {
    console.log("ERROR >>>>>>>", err);
    if (err instanceof customError_1.default) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
    return res.status(500).json({ msg: err.message });
};
exports.default = defaultErrorHandler;
