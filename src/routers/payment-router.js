import express from "express";
import Payment from "../models/payments.js";
import Client from "../models/client.js";
import axios from "axios";

const router = express.Router();

//create payment

router.post("/api/payment", async (req, res) => {
  const newPayment = new Payment(req.body);
  try {
    const client = await Client.findById(newPayment.client);
    // console.log(client);
    if (!client) {
      return res.send({ error: "Client not found!" });
    }
    if (newPayment.nextPaymentDate) {
      client.nextPaymentDate = newPayment.nextPaymentDate;
    }

    // console.log(client);
    await client.save();
    await newPayment.save();

    // After payment is saved, send SMS using the Notify.lk API
    const smsUrl = `https://app.notify.lk/api/v1/send?user_id=290810&api_key=5NQPpqHnWGUmjtKjBecH&sender_id=NotifyDEMO&to=${client.phoneNumber}&message=Your payment of ${newPayment.amount} has been successfully processed.You will receive a reminder one day before membership expires.%0AThank you!`;

    console.log(smsUrl);
    try {
      const smsResponse = await axios.get(smsUrl); // Make the API call to Notify.lk
      if (smsResponse.data.status === "success") {
        console.log("SMS sent successfully!");
      } else {
        console.log("Failed to send SMS:", smsResponse.data);
      }
    } catch (smsError) {
      console.error("Error sending SMS:", smsError.message);
    }

    res.send(newPayment);
  } catch (e) {
    res.send({ error: e });
  }
});

//read all payments
router.get("/api/payment", async (req, res) => {
  try {
    const payments = await Payment.find().populate("client");
    if (payments.length === 0) {
      return res.send({ error: "No payments available!" });
    }
    res.send(payments);
  } catch (e) {
    res.send({ error: e });
  }
});
//read a payment
router.get("/api/payment:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const payment = await Payment.findById(_id).populate("client");

    if (payment.length === 0) {
      return res.send({ error: "No payment available!" });
    }
    res.send(payment);
  } catch (e) {
    res.send({ error: e });
  }
});

//update payment

router.put("/api/payment:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const payment = await Payment.findByIdAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (payment.length === 0) {
      return res.send({ error: "No payment found!" });
    }
    const client = await Client.findById(payment.client);
    // console.log(client);
    client.nextPaymentDate = payment.nextPaymentDate;
    // console.log(client);
    await client.save();
    res.send(payment);
  } catch (e) {
    res.send({ error: e });
  }
});
//delete payment

router.delete("/api/payment:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const payment = await Payment.findByIdAndDelete({ _id });
    if (payment.length === 0) {
      return res.send({ error: "No payment found!" });
    }
    res.send(payment);
  } catch (e) {
    res.send({ error: e });
  }
});

export default router;
