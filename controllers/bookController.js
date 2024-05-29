const Joi = require("joi");
const Book = require("../models/book");

// Validation schema
const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  isbn: Joi.string().required(),
  publicationDate: Joi.date().iso().required(),
});

// Create a new book entry
const createBook = async (req, res) => {
  try {
    const { error } = bookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, author, isbn, publicationDate } = req.body;
    const newBook = new Book({ title, author, isbn, publicationDate });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read all book entries
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a single book entry by ID
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing book entry by ID
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, publicationDate } = req.body;

    const { error } = bookSchema.validate(req.body, { presence: "optional" });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (isbn) book.isbn = isbn;
    if (publicationDate) book.publicationDate = publicationDate;

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a book entry by ID
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
};
