const mongoose = require("mongoose");

// Define the book schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  publicationDate: {
    type: Date,
    required: true,
  },
});

// Create the Book model
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
