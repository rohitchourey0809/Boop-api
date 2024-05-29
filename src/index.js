const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data store
let books = [];

// Routes
app.post("/api/books", (req, res) => {
  const newBook = req.body;
  books.push(newBook);
  res.status(201).json(newBook);
});

app.get("/api/books", (req, res) => {
  res.json(books);
});

app.get("/api/books/:id", (req, res) => {
  const id = req.params.id;
  const book = books.find((book) => book.id === id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
});

app.put("/api/books/:id", (req, res) => {
  const id = req.params.id;
  const updatedBook = req.body;
  let index = books.findIndex((book) => book.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  books[index] = updatedBook;
  res.json(updatedBook);
});

app.delete("/api/books/:id", (req, res) => {
  const id = req.params.id;
  books = books.filter((book) => book.id !== id);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
