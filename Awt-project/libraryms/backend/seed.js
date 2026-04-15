import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Book from './models/Book.js';
import IssuedBook from './models/IssuedBook.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/libraryms';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected.');

    // Clear existing data
    await User.deleteMany({ email: { $in: ['admin@library.com', 'client@library.com'] } });
    await Book.deleteMany({});
    await IssuedBook.deleteMany({});

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const clientPassword = await bcrypt.hash('client123', salt);

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@library.com',
      password: adminPassword,
      role: 'admin',
    });

    const client = await User.create({
      name: 'Test Client',
      email: 'client@library.com',
      password: clientPassword,
      role: 'client',
    });

    console.log('==> Users seeded successfully.');

    // 2. Create Books
    const books = await Book.insertMany([
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        publisher: 'Scribner',
        category: 'Fiction',
        totalCopies: 5,
        availableCopies: 4,
        description: 'A novel set in the Roaring Twenties.'
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        publisher: 'Prentice Hall',
        category: 'Programming',
        totalCopies: 10,
        availableCopies: 10,
        description: 'A Handbook of Agile Software Craftsmanship.'
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        publisher: 'J. B. Lippincott & Co.',
        category: 'Classic',
        totalCopies: 3,
        availableCopies: 3,
        description: 'A novel about racial injustice.'
      },
      {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        publisher: 'MIT Press',
        category: 'Computer Science',
        totalCopies: 4,
        availableCopies: 3,
        description: 'Comprehensive guide to algorithms.'
      }
    ]);
    console.log(`==> ${books.length} Books seeded successfully.`);

    // 3. Create Issued Books (Client borrowing The Great Gatsby and Introduction to Algorithms)
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // Due in 14 days

    await IssuedBook.insertMany([
      {
        user: client._id,
        book: books[0]._id, // The Great Gatsby
        issueDate: issueDate,
        dueDate: dueDate,
        status: 'issued'
      },
      {
        user: client._id,
        book: books[3]._id, // Introduction to Algorithms
        issueDate: issueDate,
        dueDate: dueDate,
        status: 'issued'
      }
    ]);
    console.log('==> IssuedBooks seeded successfully.');

    console.log('\n---------------------------');
    console.log('All Data Seeded!');
    console.log('---------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
