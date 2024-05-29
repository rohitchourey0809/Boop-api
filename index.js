const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Define a Book schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  publicationDate: { type: Date, required: true },
});

// Create a Book model
const Book = mongoose.model("Book", bookSchema);

const validateBookData = (data) => {
  const { title, author, isbn, publicationDate } = data;
  if (!title || typeof title !== "string") {
    return "Title is required and should be a string";
  }
  if (!author || typeof author !== "string") {
    return "Author is required and should be a string";
  }
  if (!isbn || typeof isbn !== "string") {
    return "ISBN is required and should be a string";
  }
  if (!publicationDate || isNaN(Date.parse(publicationDate))) {
    return "Publication Date is required and should be a valid date";
  }
  return null;
};

app.post("/books", async (req, res) => {
  const error = validateBookData(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }
  const { title, author, isbn, publicationDate } = req.body;
  try {
    const newBook = new Book({ title, author, isbn, publicationDate });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating book", error: err.message });
  }
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching books", error: err.message });
  }
});

app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching book", error: err.message });
  }
});

app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, publicationDate } = req.body;
  const error = validateBookData(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, isbn, publicationDate },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(updatedBook);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating book", error: err.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(204).send();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
