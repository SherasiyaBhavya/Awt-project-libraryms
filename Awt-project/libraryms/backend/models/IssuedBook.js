import mongoose from 'mongoose';

const issuedBookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    issueDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['issued', 'returned', 'overdue'],
      default: 'issued'
    }
  },
  {
    timestamps: true
  }
);

const IssuedBook = mongoose.model('IssuedBook', issuedBookSchema);
export default IssuedBook;
