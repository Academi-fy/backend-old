import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./httpServer/models/user/User.js";

dotenv.config();

const mongoPassword = process.env.MONGODB_PASSWORD;
const mongoURI = `mongodb+srv://admin:${ mongoPassword }@rotteck-messenger.fejn8su.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(mongoURI,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }
).then(() => console.log('MongoDB connected.')).catch(err => console.log(err));


const user = new User(
    null,
    "1",
    "6",
    "test",
    "TEACHER",
    [],
    []
)

const users = await User.getUsers();

console.log(await User.updateUser(users[0].id, user));