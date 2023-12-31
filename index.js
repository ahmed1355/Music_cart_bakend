const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require("./routes/authRoute");


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();


app.get("/health", async (req, res) => {
    try {
      res.status(200).json("server is running");
    } catch (err) {
      console.log(err);
    }
  });

  app.use("/", authRouter);
  
  app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res
      .status(500)
      .json({ error: "Something went wrong! Please try again later." });
  });
  
  app.listen(process.env.PORT, () => {
    mongoose
      .connect(process.env.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("MongoDB Connected");
        console.log(`App listening at http://localhost:${process.env.PORT}`);
      })
      .catch((err) => {
        console.log("failed to connect", err);
      });
  });

  module.exports = app;