import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

const verifyJWT = (req, res, next) => {
  console.log(req.headers["authorization"]);
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!authHeader || !token) return res.send({ error: "Invalid!" });
  // console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) return res.sendStatus(403);
    req.email = decode.email;
    next();
  });
};

export default verifyJWT;
