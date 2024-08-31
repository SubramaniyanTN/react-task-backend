import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import defaultErrorHandler from "./ErrorHandler/defaultErrorBoundary";
import notFound from "./utils/notFound";
import http from "http";
import { Server as SocketIoServer } from "socket.io";
import UploadRouter from "./Router/uploadRoute";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type CustomRequest = Request & {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    filename: string;
    buffer: Buffer;
  };
  io: SocketIoServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
};

dotenv.config();

const app = Express();
// Create an HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the server
export const io = new SocketIoServer(server, {
  cors: {
    origin: "*", // Adjust the origin as needed for your frontend
  },
});

io.on("connection", (socket) => {
  console.log("CLient connected");
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

app.use(cors());

const PORT = process.env.PORT || 3001;
app.use(
  "/api",
  (req, res, next) => {
    req.io = io;
    next();
  },
  UploadRouter
);

// Not Found Middleware
app.use(notFound);

// Error Handling Middleware
app.use(defaultErrorHandler);

// Start the server
const startingServer = async (): Promise<void> => {
  try {
    server.listen(PORT, () => {
      console.log("Server is running on ", PORT);
    });
  } catch (error) {
    console.error(error);
  }
};

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
