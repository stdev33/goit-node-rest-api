import app from "./app.js";
import mongoose from "mongoose";
import "dotenv/config";

const { DB_URI, SERVER_PORT = 3000 } = process.env;
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose
  .connect(DB_URI, clientOptions)
  .then(() => {
    console.log("Database connection successful");
    app.listen(SERVER_PORT, () => {
      console.log(`Server is running. Use our API on port: ${SERVER_PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
