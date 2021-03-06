const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

//Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

//Route Files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

//Dev loggin middleware
if (process.env.NODE_env === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler); //really important for middleware to be executed after the routes in order to be used.

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server started on Port ${PORT} and in ${process.env.NODE_env} mode`.yellow
      .bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
