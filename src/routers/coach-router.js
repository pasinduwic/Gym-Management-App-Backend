import express from "express";
import Coach from "../models/coach.js";

const router = express.Router();

//create coach

router.post("/api/coach", async (req, res) => {
  const checkcoach = await Coach.findOne({
    phoneNumber: req.body.phoneNumber,
  });
  if (checkcoach) {
    return res.send({
      error: "coach alreday exist with the same phone number!",
    });
  }
  const newcoach = new Coach(req.body);
  try {
    await newcoach.save();
    res.send(newcoach);
  } catch (e) {
    res.send({ error: e });
  }
});

//read all coach
router.get("/api/coach", async (req, res) => {
  try {
    const coaches = await Coach.find();
    // console.log(coaches);
    if (coaches.length === 0) {
      return res.send({ error: "No coaches available!" });
    }
    res.send(coaches);
  } catch (e) {
    res.send({ error: e });
  }
});
//read a coach
router.get("/api/coach:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const coach = await Coach.findById(_id);

    if (coach.length === 0) {
      return res.send({ error: "No coach available!" });
    }
    res.send(coach);
  } catch (e) {
    res.send({ error: e });
  }
});

//update coach

router.put("/api/coach:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const coach = await Coach.findByIdAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (coach.length === 0) {
      return res.send({ error: "No coach found!" });
    }
    res.send(coach);
  } catch (e) {
    res.send({ error: e });
  }
});
//delete coach

router.delete("/api/coach:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const coach = await Coach.findByIdAndDelete({ _id });
    if (coach.length === 0) {
      return res.send({ error: "No coach found!" });
    }
    res.send(coach);
  } catch (e) {
    res.send({ error: e });
  }
});

export default router;
