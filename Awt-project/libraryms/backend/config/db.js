import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is required in .env');
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: 'books' }).toArray();
    if (collections.length > 0) {
      try {
        await db.collection('books').dropIndex('isbn_1');
        console.log('Dropped stale isbn index from books collection');
      } catch (err) {
        if (err.codeName !== 'IndexNotFound') {
          throw err;
        }
      }
    }

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
