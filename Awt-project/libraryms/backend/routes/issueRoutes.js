import express from 'express';
import { body } from 'express-validator';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';
import {
  issueBook,
  getMyBooks,
  returnBook,
  getAllIssues,
  updateIssueStatus
} from '../controllers/issueController.js';

const router = express.Router();

router.use(protect);
router.post(
  '/issue-book',
  [body('bookId').notEmpty().withMessage('Book ID is required')],
  asyncHandler(issueBook)
);
router.get('/my-books', asyncHandler(getMyBooks));
router.post('/return-book/:issueId', asyncHandler(returnBook));

router.get('/', authorizeRoles('admin'), asyncHandler(getAllIssues));
router.put('/:issueId', authorizeRoles('admin'), asyncHandler(updateIssueStatus));

export default router;
