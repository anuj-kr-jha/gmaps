import { MongoClient } from 'mongodb';

const connectToMongoDB = async () => {
  const client = new MongoClient(process.env.MONGO_URI!);
  await client.connect();
  console.log('Connected to MongoDB');

  // You can export the client or database for use in other files
  return client.db('gmaps');
};

export default await connectToMongoDB();
