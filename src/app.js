import express from "express";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";

import handlers from "./middlewares/handlers.js";
import hateoas from "./middlewares/hateoas.js";
import order from "./middlewares/order.js";
import database from "./config/database.js";
import routes from "./routes.js";


dotenv.config();
database.config(process.env.DATABASE);

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(handlers);
app.use(hateoas);
app.use(order);
app.use(routes);

export default app;
