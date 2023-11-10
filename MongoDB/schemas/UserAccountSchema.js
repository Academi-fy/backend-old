import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const UserAccountSchema = new Schema({

    id: {
        type: ObjectId,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }

});

export default mongoose.model("UserAccount", UserAccountSchema);
