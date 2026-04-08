import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { IdeaRoutes } from "../modules/idea/idea.route";
import { VoteRoutes } from "../modules/vote/vote.route";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/categories", CategoryRoutes);
routes.use("/ideas", IdeaRoutes);
routes.use("/votes", VoteRoutes);
// routes.use("/category", categoryRouter);
// routes.use("/meals", mealRouter);
// routes.use("/providers", providerRouter);
// routes.use("/orders", orderRouter);
// routes.use("/admin", adminRouter);

// routes.use("/meals/", authRouter);
// routes.use("/orders/", authRouter);

export default routes;
