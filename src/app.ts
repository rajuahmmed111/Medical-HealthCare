import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Developer!");
});

export default app;