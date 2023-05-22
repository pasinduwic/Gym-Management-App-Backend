import express from "express";
import Client from "../models/client.js";

const router = express.Router();

//create client

router.post("/api/client", async (req, res) => {
  const checkClient = await Client.findOne({
    phoneNumber: req.body.phoneNumber,
  });
  if (checkClient) {
    return res.send({
      error: "Client alreday exist with the same phone number!",
    });
  }
  const newClient = new Client(req.body);
  try {
    await newClient.save();
    res.send(newClient);
  } catch (e) {
    res.send({ error: e });
  }
});

//read all clients
router.get("/api/client", async (req, res) => {
  try {
    const clients = await Client.find().populate("assignedCoach");
    if (clients.length === 0) {
      return res.send({ error: "No clients available!" });
    }
    console.log(clients);
    res.send(clients);
  } catch (e) {
    res.send({ error: e });
    console.log(e);
  }
});
//read a client
router.get("/api/client:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const client = await Client.findById(_id).populate("assignedCoach");

    if (client.length === 0) {
      return res.send({ error: "No client available!" });
    }
    res.send(client);
  } catch (e) {
    res.send({ error: e });
  }
});

//update Client

router.put("/api/client:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const client = await Client.findByIdAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (client.length === 0) {
      return res.send({ error: "No client found!" });
    }
    res.send(client);
  } catch (e) {
    res.send({ error: e });
  }
});
//delete Client

router.delete("/api/client:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const client = await Client.findByIdAndDelete({ _id });
    if (client.length === 0) {
      return res.send({ error: "No client found!" });
    }
    res.send(client);
  } catch (e) {
    res.send({ error: e });
  }
});

export default router;
