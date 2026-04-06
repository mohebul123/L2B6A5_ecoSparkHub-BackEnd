import express, { Application, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";
import { notFound } from "./middlewares/notFound";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Apollo Gears World!");
});

//globalErrorHandler
app.use(globalErrorHandler);
//notFoundRoute
app.use(notFound);
export default app;
