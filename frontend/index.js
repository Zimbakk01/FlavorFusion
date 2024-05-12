import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import helmet from "helmet";
import path from "path";

import dbConnection from "./dbConfig/index.js"
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

const __dirname = path.resolve(path.dirname(""));

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, "views/build")));

const PORT = process.env.PORT || 8800;
dbConnection();


app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.options('/api/resource', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(200).send();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(router);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });