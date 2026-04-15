import { validationResult } from 'express-validator';
import IssuedBook from '../models/IssuedBook.js';
import Book from '../models/Book.js';

export const issueBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { bookId, dueDate } = req.body;
  const userId = req.user._id;

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (book.availableCopies < 1) {
    return res.status(400).json({ message: 'No copies available' });
  }

  const issue = await IssuedBook.create({
    user: userId,
    book: book._id,
    dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  });

  book.availableCopies -= 1;
  await book.save();

  res.status(201).json(issue);
};

export const getMyBooks = async (req, res) => {
  const issuedBooks = await IssuedBook.find({ user: req.user._id })
    .populate('book')
    .sort({ createdAt: -1 });

  res.json(issuedBooks);
};

export const returnBook = async (req, res) => {
  const issue = await IssuedBook.findById(req.params.issueId).populate('book');
  if (!issue) {
    return res.status(404).json({ message: 'Issue record not found' });
  }

  if (issue.status === 'returned') {
    return res.status(400).json({ message: 'Book already returned' });
  }

  issue.returnDate = new Date();
  issue.status = 'returned';
  await issue.save();

  const book = await Book.findById(issue.book._id);
  if (book) {
    book.availableCopies += 1;
    await book.save();
  }

  res.json(issue);
};

export const getAllIssues = async (req, res) => {
  const issues = await IssuedBook.find()
    .populate('user', 'name email role')
    .populate('book', 'title author isbn')
    .sort({ createdAt: -1 });

  res.json(issues);
};

export const updateIssueStatus = async (req, res) => {
  const issue = await IssuedBook.findById(req.params.issueId);
  if (!issue) {
    return res.status(404).json({ message: 'Issue record not found' });
  }

  const { status } = req.body;
  if (!['issued', 'returned', 'overdue'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  issue.status = status;
  if (status === 'returned' && !issue.returnDate) {
    issue.returnDate = new Date();
  }

  await issue.save();
  res.json(issue);
};
