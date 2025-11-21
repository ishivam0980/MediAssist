import mongoose, { Schema, model, models } from "mongoose";

const PredictionSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    disease: {
      type: String,
      enum: ["diabetes", "heart-disease", "parkinsons"],
      required: true,
    },
    inputData: {
      type: Object, // Stores the form data (JSON)
      required: true,
    },
    result: {
      prediction: String,
      probability: Number,
      risk_level: String,
      message: String,
    },
  },
  { timestamps: true }
);

const Prediction = models.Prediction || model("Prediction", PredictionSchema);

export default Prediction;