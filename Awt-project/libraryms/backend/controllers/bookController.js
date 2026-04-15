import Book from '../models/Book.js';

export const getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
};

export const createBook = async (req, res) => {
  const { title, author, publisher, category, totalCopies, description } = req.body;

  const book = await Book.create({
    title,
    author,
    publisher,
    category,
    totalCopies: Number(totalCopies) || 1,
    availableCopies: Number(totalCopies) || 1,
    description
  });

  res.status(201).json(book);
};

export const updateBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const { title, author, publisher, category, totalCopies, description } = req.body;

  book.title = title || book.title;
  book.author = author || book.author;
  book.publisher = publisher || book.publisher;
  book.category = category || book.category;
  book.description = description || book.description;

  if (totalCopies !== undefined) {
    const diff = Number(totalCopies) - book.totalCopies;
    book.totalCopies = Number(totalCopies);
    book.availableCopies = Math.max(0, book.availableCopies + diff);
  }

  const updatedBook = await book.save();
  res.json(updatedBook);
};

export const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  await book.remove();
  res.json({ message: 'Book deleted successfully' });
};
