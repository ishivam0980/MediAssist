import mongoose, { Schema, model, models } from "mongoose";

const OTPSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Document automatically deletes after 300 seconds (5 mins)
  },
});

const OTP = models.OTP || model("OTP", OTPSchema);

export default OTP;