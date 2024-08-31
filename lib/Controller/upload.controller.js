"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = void 0;
const asyncWrapper_1 = require("../ErrorHandler/asyncWrapper");
const bull_1 = __importDefault(require("bull"));
const index_1 = require("../index");
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_HOST = process.env.REDIS_HOST;
const uploadQueue = new bull_1.default("file-upload", {
    redis: {
        port: Number(REDIS_PORT) || undefined,
        host: REDIS_HOST || undefined,
    },
});
uploadQueue.process((job, done) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileData } = job.data;
    // Simulate processing with progress
    for (let i = 0; i <= 100; i += 10) {
        yield new Promise((resolve) => setTimeout(resolve, 500)); // Simulate time-consuming processing
        index_1.io.emit("uploadProgress", { percent: i });
        job.progress(i); // Update the progress
    }
    done(); // Mark the job as completed
}));
exports.uploadController = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    // Add file to the queue
    uploadQueue.add({ fileData: file.buffer });
    // Return response immediately
    return res.status(200).json({ message: "File uploaded successfully" });
}));
