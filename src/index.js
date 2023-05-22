import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Credentials from "./middleware/credentials.js";
import corsOptions from "./middleware/corsOptions.js";
import "./db/mongoose.js";
import userRouter from "./routers/user-router.js";
import clientRouter from "./routers/client-router.js";
import paymentRouter from "./routers/payment-router.js";
import coachRouter from "./routers/coach-router.js";
import verifyJWT from "./middleware/verifyJWT.js";

const app = express();

const port = 4000;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Credentials);

app.use(cors(corsOptions));

//routers
app.use(userRouter);
app.use(verifyJWT);
app.use(clientRouter);
app.use(paymentRouter);
app.use(coachRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
