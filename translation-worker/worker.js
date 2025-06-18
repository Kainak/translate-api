import 'dotenv/config';
import database from '../api/config/database.js';
import TranslationConsumer from './consumer.js';


const startWorker = async () => {
  try {
    console.log('Starting translation worker...');
    
    // Connect to MongoDB
    await database.config(process.env.DATABASE);
    
    // Start the consumer
    const consumer = new TranslationConsumer();
    await consumer.start();

    console.log('Translation worker started and listening for messages.');
  } catch (error) {
    console.error('Failed to start translation worker:', error);
    process.exit(1); // Exit with error
  }
};

startWorker(); 