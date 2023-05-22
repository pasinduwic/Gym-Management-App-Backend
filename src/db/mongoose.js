import mongoose from "mongoose";
const mongooseConnectionStringUser =
  "mongodb+srv://pasinduw:pasiD%40nc12345@psd1st.wtff6.mongodb.net/BusinessSystem?retryWrites=true&w=majority";
const mongooseConnectionStringGym =
  "mongodb+srv://pasinduw:pasiD%40nc12345@psd1st.wtff6.mongodb.net/GymManagementSystem?retryWrites=true&w=majority";

export const userDb = mongoose.createConnection(mongooseConnectionStringUser, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("User Database connected");
export const gymDb = mongoose.createConnection(mongooseConnectionStringGym, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("Gym Database connected");

// export default { userDb, gymDb };
// export default gymDb
