import mongoose from "mongoose";

const MONGO_DB_URI = process.env.MONGODB_URI!;

if(!MONGO_DB_URI){
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if(!cached){
    cached = (global as any).mongoose = {conn:null, promise:null};
}

export async function  connectToDatabase() {
    if(cached.conn) return cached.conn;

    if(!cached.conn) {
        cached.promise = mongoose.connect(MONGO_DB_URI).then((m) => m);
    }
    cached.conn = await cached.promise;

    return cached.conn;
}