import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    publisher: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Book = mongoose.model('Book', bookSchema);
export default Book;
