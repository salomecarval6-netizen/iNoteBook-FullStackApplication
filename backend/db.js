import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// In production, uses cloud MongoDB URI (MongoDB Atlas);
// falls back to local MongoDB for development.

// DEPLOYMENT FIX: Do not silently fall back to local MongoDB in production.
const mongoURI = process.env.MONGO_URI ||
  (process.env.NODE_ENV !== 'production'
    ? 'mongodb://127.0.0.1:27017/inotebook'
    : null);

/*In older versions of Mongoose (version 6 and below), you could pass a callback function directly into
the connection method like this: mongoose.connect(uri, () => { ... }). However, in modern versions of Mongoose (versions 7 and above),
callbacks are completely removed and it only accepts modern JavaScript promises (.then() and .catch()) or async/await

const connectToMongo = () =>{
  mongoose.connect(dbURI, ()=>{
    console.log("connected")
  })
}
module.exports = connectToMongo;
*/

// A]
const connectToMongo = async () => {
    try {
        // DEPLOYMENT FIX: Fail immediately if MONGO_URI is missing.
        if (!mongoURI) {
            throw new Error("MONGO_URI is not configured");
        }

        // DEPLOYMENT FIX: await ensures connection completes before server startup.
        await mongoose.connect(mongoURI);

        console.log("Connected to Mongo Successfully");
    } catch (err) {
        console.error("Failed to connect to Mongo:", err);

        // DEPLOYMENT FIX: Re-throw the error so index.js can stop startup.
        throw err;
    }
};

export default connectToMongo;


/*
B]
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to Mongo Successfully");
    } catch (err) {
        console.error("Failed to connect to Mongo:", err);
    }
}

module.exports = connectToMongo;
*/