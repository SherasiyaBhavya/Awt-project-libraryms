import express from 'express';
import { body } from 'express-validator';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';

const router = express.Router();

router.get('/', asyncHandler(getBooks));
router.get('/:id', asyncHandler(getBookById));

router.use(protect, authorizeRoles('admin'));
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('totalCopies').isInt({ min: 1 }).withMessage('Total copies must be a positive number')
  ],
  asyncHandler(createBook)
);
router.put('/:id', asyncHandler(updateBook));
router.delete('/:id', asyncHandler(deleteBook));

export default router;
