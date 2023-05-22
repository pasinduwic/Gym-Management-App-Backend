import { Schema, model } from "mongoose";
import { gymDb } from "../db/mongoose.js";

const paymentSchema = Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  nextPaymentDate: {
    type: Date,
  },
});

const Payment = gymDb.model("Payment", paymentSchema);
export default Payment;
