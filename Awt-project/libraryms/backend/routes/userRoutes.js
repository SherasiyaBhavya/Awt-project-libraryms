import express from 'express';
import { body } from 'express-validator';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.use(protect, authorizeRoles('admin'));

router.get('/', asyncHandler(getUsers));
router.get('/:id', asyncHandler(getUserById));
router.put(
  '/:id',
  [
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('role').optional().isIn(['admin', 'client']).withMessage('Invalid role')
  ],
  asyncHandler(updateUser)
);
router.delete('/:id', asyncHandler(deleteUser));

export default router;
