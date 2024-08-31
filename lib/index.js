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
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const defaultErrorBoundary_1 = __importDefault(require("./ErrorHandler/defaultErrorBoundary"));
const notFound_1 = __importDefault(require("./utils/notFound"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const uploadRoute_1 = __importDefault(require("./Router/uploadRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Create an HTTP server
const server = http_1.default.createServer(app);
// Attach Socket.IO to the server
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Adjust the origin as needed for your frontend
    },
});
exports.io.on("connection", (socket) => {
    console.log("CLient connected");
    socket.on("disconnect", () => {
        console.log("A client disconnected");
    });
});
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 3001;
app.use("/api", (req, res, next) => {
    req.io = exports.io;
    next();
}, uploadRoute_1.default);
// Not Found Middleware
app.use(notFound_1.default);
// Error Handling Middleware
app.use(defaultErrorBoundary_1.default);
// Start the server
const startingServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        server.listen(PORT, () => {
            console.log("Server is running on ", PORT);
        });
    }
    catch (error) {
        console.error(error);
    }
});
startingServer();
// // POST route for file upload
// app.post("/upload", upload.single("file"), (req, res) => {
//   const file = req.file;
//   if (!file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }
//   const job = uploadQueue.add({ fileData: file.buffer });
//   job.on("progress", (progress: any) => {
//     io.emit("uploadProgress", { percent: progress });
//   });
//   job.on("completed", () => {
//     io.emit("uploadProgress", { percent: 100 });
//   });
//   return res.status(200).json({ message: "File uploaded successfully" });
// });
// // Job processing logic
// uploadQueue.process(async (job: any, done: any) => {
//   const { fileData } = job.data;
//   // Simulate processing
//   let progress = 0;
//   for (let i = 0; i <= 100; i += 10) {
//     await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate time-consuming processing
//     progress = i;
//     job.progress(progress);
//   }
//   done();
// });
