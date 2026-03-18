import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL as string)
        console.log("MongoDB Connected")
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1) //exit process with failure
    }
}