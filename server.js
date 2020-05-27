const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

//Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

//Route Files
const bootcamps = require("./routes/bootcamps");

const app = express();

// Body Parser
app.use(express.json());

//Dev loggin middleware
if (process.env.NODE_env === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

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
