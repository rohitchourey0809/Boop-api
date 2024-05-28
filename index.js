// index.js

const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

app.use(bodyParser.json());

let books = [];

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

app.post("/books", (req, res) => {
      const error = validateBookData(req.body);
      if (error) {
        return res.status(400).json({ message: error });
      }
  const { title, author, isbn, publicationDate } = req.body;
  if (!title || !author || !isbn || !publicationDate) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const newBook = { id: uuidv4(), title, author, isbn, publicationDate };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.get("/books", (req, res) => {
  res.status(200).json(books);
});

app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.status(200).json(book);
});

app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, publicationDate } = req.body;
  const bookIndex = books.findIndex((b) => b.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!title || !author || !isbn || !publicationDate) {
    return res.status(400).json({ message: "All fields are required" });
  }
  books[bookIndex] = { id, title, author, isbn, publicationDate };
  res.status(200).json(books[bookIndex]);
});

app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  books = books.filter((b) => b.id !== id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
