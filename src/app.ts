import httpStatus from "http-status";
import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import router from "./app/Routes";
import ApiNotFound from "./app/Middleware/apiNotFound";
import GlobalErrorHandler from "./app/Middleware/globalErrorHandler";

app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Developer!");
});

// Setup API routes
app.use("/api/v1", router);

// Global error handler
app.use(GlobalErrorHandler);

// Handle 404 errors
app.use((req: Request, res: Response) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      method: req.method,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
