import express, {Request, Response } from "express";
import 'dotenv/config'
import fileUpload from "express-fileupload";
import { router } from "./routers/userRouter";
import sequelize from "./db/db";
import path from "path";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (e: any) {
    console.log(`ERR: ${e.message}`);
  }
};

start();
