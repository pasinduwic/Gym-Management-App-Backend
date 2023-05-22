import { Schema, model } from "mongoose";
import { gymDb } from "../db/mongoose.js";

const clientSchema = Schema({
  clientNo: {
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
  registeredDate: {
    type: Date,
    required: true,
  },
  registrationFee: {
    type: Number,
  },
  type: {
    type: Number,
    required: true,
  },
  nextPaymentDate: {
    type: Date,
  },
  assignedCoach: {
    type: Schema.Types.ObjectId,
    ref: "Coach",
  },
});

const Client = gymDb.model("Client", clientSchema);
export default Client;
