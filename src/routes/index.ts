import { Router } from "express";
import { authRouter } from "../modules/auth.route";

const routes = Router();

routes.use("/auth", authRouter);
// routes.use("/category", categoryRouter);
// routes.use("/meals", mealRouter);
// routes.use("/providers", providerRouter);
// routes.use("/orders", orderRouter);
// routes.use("/admin", adminRouter);

// routes.use("/meals/", authRouter);
// routes.use("/orders/", authRouter);

export default routes;
