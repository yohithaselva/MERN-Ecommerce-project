import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbconnect = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URL); // after net provide db name
    console.log(`Mongodb connected ${connected.connection.host}`);
  } catch (error) {
    console.log(`Eroor ${error.message}`); //for print error
  }
};

export default dbconnect;
