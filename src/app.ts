import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { notFound } from "./middlewares/notFound";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();

// parsers
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);
app.use(cookieParser());

// application routes
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Spark Eco Hub World!");
});

//globalErrorHandler
app.use(globalErrorHandler);
//notFoundRoute
app.use(notFound);
export default app;
