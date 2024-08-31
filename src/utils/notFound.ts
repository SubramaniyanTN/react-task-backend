import { Request, Response } from "express";

const notFound = (req: Request, res: Response) => {
  return res.status(404).json({ message: "Router Path does not exists" });
};

export default notFound;
