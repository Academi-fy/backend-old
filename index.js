import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./httpServer/models/users/User.js";
import UserAccount from "./httpServer/models/users/UserAccount.js";

dotenv.config();

const mongoPassword = process.env.MONGODB_PASSWORD;
const mongoURI = `mongodb+srv://admin:${ mongoPassword }@rotteck-messenger.fejn8su.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(mongoURI,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }
).then(() => console.log('MongoDB connected.')).catch(err => console.log(err));


