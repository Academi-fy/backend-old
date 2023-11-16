import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const UserAccountSchema = new Schema({


    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    settings: [
        {
            name: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }
    ]

});

/**
 * Exporting the UserAccount model
 * @name UserAccount
 * @type {mongoose.Model}
 */
export default mongoose.model("UserAccount", UserAccountSchema);
