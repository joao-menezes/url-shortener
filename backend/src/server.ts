import mongoose from "mongoose";
import app from "./config/database.config";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT;
const MONGO_URI = String(process.env.MONGO_URL);
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

async function establishMongoConnection(attempt = 1): Promise<void> {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Successfully connected to MongoDB.");

        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });

        // Optional: Initialize scheduled tasks here, if needed
        // cron.schedule('0 0 * * *', afterOneDayWipeServer); // Example: daily midnight

    } catch (error) {
        console.error(`Connection attempt ${attempt}/${MAX_RETRIES} to MongoDB failed:`, error);

        if (attempt < MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds... (Attempt ${attempt + 1})`);
            setTimeout(() => establishMongoConnection(attempt + 1), RETRY_DELAY_MS);
        } else {
            console.error("Unable to establish a MongoDB connection after multiple attempts. Terminating application.");
            process.exit(1);
        }
    }
}

establishMongoConnection();
