import mongoose from 'mongoose';
import { env } from './env.js';
export async function connectDatabase(retries = 5, delayMs = 5000) {
    mongoose.set('strictQuery', true);
    // Register connection lifecycle loggers
    mongoose.connection.on('connecting', () => {
        console.log('Mongoose: Connecting to MongoDB...');
    });
    mongoose.connection.on('connected', () => {
        console.log('Mongoose: Connected successfully to MongoDB.');
    });
    mongoose.connection.on('error', (err) => {
        console.error('Mongoose: Database connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
        console.warn('Mongoose: Disconnected from MongoDB.');
    });
    // Watch for index building statuses on all registered models
    mongoose.connection.once('open', () => {
        console.log('Mongoose: Connection fully open. Checking model index builds...');
        const registeredModels = mongoose.modelNames();
        console.log(`Mongoose: Registered models: [${registeredModels.join(', ')}]`);
        registeredModels.forEach((modelName) => {
            const model = mongoose.model(modelName);
            model.on('index', (error) => {
                if (error) {
                    console.error(`Mongoose: Index build error on model [${modelName}]:`, error);
                }
                else {
                    console.log(`Mongoose: Indexes verified/built successfully on model [${modelName}].`);
                }
            });
        });
    });
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Mongoose: Database connection attempt ${attempt}/${retries}...`);
            // Strip potentially raw URI trailing/leading whitespace
            const connectionUri = env.mongoUri.trim();
            await mongoose.connect(connectionUri);
            return;
        }
        catch (err) {
            console.error(`Mongoose: Connection attempt ${attempt} failed:`, err.message);
            if (attempt === retries) {
                throw new Error(`Mongoose: Failed to connect to MongoDB after ${retries} attempts.`);
            }
            console.log(`Mongoose: Retrying in ${delayMs / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
}
