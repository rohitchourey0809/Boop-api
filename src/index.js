const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const books = require("./routes/books");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3000;
app.use(
  cors({
    credentials: true,
  })
);
app.use(bodyParser.json());


app.use("/api/books", books);
// MongoDB connection
mongoose
  .connect(
    process.env.MONGO_URI ?? "mongodb://localhost:27017/book-api"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });



// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports = app; // Export for Vercel
