require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const booking = require("./Routes/BookingRoutes");
const room = require("./Routes/RoomRoutes");
const { database } = require("./Database/database");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*"); // Allow any origin dynamically
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);
app.use("/api", booking);
app.use("/api", room);

database();

module.exports = app;
