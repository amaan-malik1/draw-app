import mongoose, { Schema, ObjectId } from "mongoose";
import bcrypt from "bcrypt";


const UserSchema = new Schema({
    firstName: { type: String, minLength: 3, required: true },
    lastName: { type: String, minLength: 3, required: true },
    email: { type: String, minLength: 3, required: true, unique: true },
    password: { type: String, minLength: 8, required: true },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.log("Error while hashinng password", error);
        next(error as Error);
    }

})

const userModel = mongoose.model("User", UserSchema);

export default userModel;