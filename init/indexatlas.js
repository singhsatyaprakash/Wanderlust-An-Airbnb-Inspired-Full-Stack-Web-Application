const mongoose = require("mongoose");
require("dotenv").config();

const initData = require("../init/data.js");
const Listing = require("../models/listing.js");

const uri = process.env.ATLASDB_URL;

if (!uri) {
    console.error("MongoDB connection string is missing. Check your .env file.");
    process.exit(1);
}

async function connectDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,  // Timeout after 5 seconds if no response
            socketTimeoutMS: 45000,         // Keep socket open for 45 seconds
        });
        console.log("Connected to MongoDB Atlas.");

        // Optional: Check the connection state
        if (mongoose.connection.readyState !== 1) {
            throw new Error("Mongoose is not connected.");
        }

        // Proceed with database operations
        await Listing.deleteMany({}); // Deleting old data
        console.log("Old data deleted.");

        await Listing.insertMany(
            initData.data.map(obj => ({ ...obj, owner: '67ce827d5ad9104ad212f1ed' }))
        );
        console.log("Data initialized.");

        // Close the connection
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    } catch (err) {
        console.error("Database connection error:", err.message);
        process.exit(1);
    }
}

connectDB();
