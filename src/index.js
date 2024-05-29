const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const books = require("./routes/book");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MongoDB URI is not defined in the environment variables.');
  process.exit(1);
}

mongoose.connect(mongoUri);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(cors());
app.use(bodyParser.json());

app.use("/api/books", books);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
