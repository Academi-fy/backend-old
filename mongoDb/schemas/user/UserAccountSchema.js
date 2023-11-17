import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a user account.
 * @param {String} username - The username of the user.
 * @param {String} password - The password of the user.
 * @param {Array<UserAccountSetting>} settings - The settings of the user.
 * @param {String} settings.name - The name of the setting.
 * @param {String} settings.value - The value of the setting.
 * @param {Date} createdAt - The date the ticket was created.
 * @param {Date} updatedAt - The date the ticket was last updated.
 * @return {Schema} The schema for a user account.
 */
const UserAccountSchema = new Schema(
    {

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

    }
);

/**
 * Exporting the UserAccount model
 * @name UserAccount
 * @type {mongoose.Model}
 */
export default mongoose.model("UserAccount", UserAccountSchema);
