import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "../routes/router";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/", router);

export default app;