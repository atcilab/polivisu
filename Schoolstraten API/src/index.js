const express = require("express");
const app = express();
const { config } = require("dotenv");
const cors = require("cors");
const { connect } = require("./utils/db");
const { auth } = require("./guards/auth");
const morgan = require("morgan");

config();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("combined"));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/user", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/weather", require("./routes/weather"));
app.use("/api/uploads", require("./routes/upload"));
app.use("/api/cities", require("./routes/cities"));
app.get("/", async (request, response, next) => {
  return response
    .status(200)
    .json({ message: "Schoolstraten API is alive!", user: request.user });
});

app.use((request, response, next) => {
  return response.status(404).json({ message: "Not Found" });
});

app.use((error, request, response, next) => {
  return response
    .status(error.status || 500)
    .json({ error: error.message || "Internal Server Error" });
});

app.listen(process.env.PORT || 8080, async () => {
  console.log(`Server is up and running on http://localhost:${process.env.PORT}`);

  try {
    const db = await connect();
    console.log("Connected to database");
  } catch (error) {
    console.log("Error while trying to connect with the database");
    console.log(error);
  }
});
