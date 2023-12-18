const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDB = (url) => {
  mongoose.set("strictQuery", false);
  return mongoose
    .connect(url)
    .then(console.log(chalk.yellow("DB Connected sucessfully...")))
    .catch((error) =>
      console.log(chalk.red("Error Connecting to DB " + error))
    );
};

module.exports = connectDB;
