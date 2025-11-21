import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false, // Google users won't have this
      select: false,   // Security: Don't return password in queries by default
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["google", "email"],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // For email users, true after OTP. For Google, true immediately.
    },
    phone: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    bloodType: { type: String },
    height: { type: String }, // e.g. "5'10"" or "178cm"
  },
  { timestamps: true }
);

// Prevent Mongoose from recompiling the model in development
if (models.User) {
  delete models.User;
}

const User = model("User", UserSchema);

export default User;