import express from "express";
import User from "../models/user.js";

const router = express.Router();
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

//login

router.post("/api/users/login", async (req, res) => {
  // console.log(req.body);
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    // console.log(user);
    if (!user) {
      return res.send({ error: "Invalid Credentials" });
    }

    const accessToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "600s",
      }
    );
    const refreshToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    user.refreshToken = refreshToken;
    user.save();
    const newUser = await User.getUserPublicData(user);
    // console.log(user);
    newUser.accessToken = accessToken;

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,

      // domain: "https://gg85fw-3000.csb.apph",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send(newUser);
  } catch (e) {
    console.log(e);
    res.send({ error: e });
  }
});
//logout

router.get("/api/users/logout", async (req, res) => {
  // console.log(req.body);
  try {
    const cookies = req.cookies;

    if (!cookies) return res.send({ sucess: "Loged out!" });

    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken });

    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
      });

      return res.send({ sucess: "Loged out!" });
    }

    user.refreshToken = "";
    user.save();
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    // console.log(user);
    // console.log(res.cookies);
    return res.send({ sucess: "Loged out!" });
  } catch (e) {
    console.log(e);
    res.send({ error: e });
  }
});

//refresh

router.get("/api/users/refresh", async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies) return res.send({ error: "Invalid!" });

    const refreshToken = cookies.jwt;
    // console.log("refreshToken");
    // console.log(refreshToken);
    const user = await User.findOne({ refreshToken });
    if (!user) return res.send({ error: "Invalid!" });
    const newUser = await User.getUserPublicData(user);
    // console.log(user);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decode) => {
        if (err || user.email !== decode.email)
          return res.send({ error: "Invalid!" });
        const accessToken = jwt.sign(
          { email: decode.email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "600s",
          }
        );

        // console.log(user);
        newUser.accessToken = accessToken;
        res.json(newUser);
      }
    );
  } catch (e) {
    console.log(e);
    res.send({ error: e });
  }
});

export default router;
