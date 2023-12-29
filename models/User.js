// Import dependencies
import mongoose from "mongoose";

// Define the Person schema

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Create the Person model
const User = mongoose.model("User", userSchema);

// Export the Person model to use it in other files
export default User;
