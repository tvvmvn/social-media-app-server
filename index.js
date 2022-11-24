const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const indexRouter = require("./routes/index");
require('dotenv').config();

// # DATABASE
const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// const seed = require("./seed");

// # MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static("public"));
app.use(express.static("data"));
app.use('/', indexRouter);

// # ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json(err); 
})

// # SERVER RUNNING MESSAGE
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})
