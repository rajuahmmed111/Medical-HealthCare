import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import router from "./app/Routes";

app.use(cors());

// Setup API routes
app.use("/api/v1", router);

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Developer!");
});

export default app;
