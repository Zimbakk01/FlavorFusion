import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 *
 * @return Promise<void> a Promise that resolves when the database connection is established successfully
 */
const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

export default dbConnection;