import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

export async function connectDB() {
    try {
        if (!MONGO_URI) {
            console.error("❌ MongoDB connection failed: MONGO_URI is not defined in .env");
            process.exit(1);
        }

        await mongoose.connect(MONGO_URI);

        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
