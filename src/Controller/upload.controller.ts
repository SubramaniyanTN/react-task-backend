import { NextFunction, Response } from "express";
import { asyncWrapper } from "../ErrorHandler/asyncWrapper";
import Queue from "bull";
import { CustomRequest } from "..";
import { io } from "../index";

const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_HOST = process.env.REDIS_HOST;

const uploadQueue = new Queue("file-upload", {
  redis: {
    port: Number(REDIS_PORT) || undefined,
    host: REDIS_HOST || undefined,
  },
});

uploadQueue.process(async (job: any, done: any) => {
  const { fileData } = job.data;
  // Simulate processing with progress
  for (let i = 0; i <= 100; i += 10) {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate time-consuming processing
    io.emit("uploadProgress", { percent: i });
    job.progress(i); // Update the progress
  }

  done(); // Mark the job as completed
});

export const uploadController = asyncWrapper(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Add file to the queue
    uploadQueue.add({ fileData: file.buffer });
    // Return response immediately
    return res.status(200).json({ message: "File uploaded successfully" });
  }
);
