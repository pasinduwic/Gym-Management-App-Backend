import { Schema, model } from "mongoose";
import { gymDb } from "../db/mongoose.js";

const coachSchema = Schema({
  coachNo: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
  },
});

const Coach = gymDb.model("Coach", coachSchema);
export default Coach;
