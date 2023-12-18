require("express-async-errors");
require("dotenv").config();
// express

const express = require("express");
const app = express();
// rest of the packages
const chalk = require("chalk");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
// database
const connectDB = require("./db/connect");

const userRouter = require("./routes/userRoutes");
const cardRouter = require("./routes/cardRoutes");

const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(bodyParser.json());

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(chalk.blue(`Server is listening on port ${port}...`))
    );
  } catch (error) {
    console.log(error);
  }
};

start();
