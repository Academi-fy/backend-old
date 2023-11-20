/**
 * @file index.js - Class launching the HTTP server.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoPassword = process.env.MONGODB_PASSWORD;
const mongoURI = `mongodb+srv://admin:${ mongoPassword }@rotteck-messenger.fejn8su.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log('MongoDB connected.')).catch(err => console.log(err));