// Import necessary modules and configurations
import express from "express";
import mongoose from "mongoose";
import User from "./models/User.js";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: "./configs/.env" });

// Create an Express application
const app = express();

// Define the port for the server to listen on
const port = process.env.PORT || 4000;
const url = process.env.MONGO_URI;

// Assign the router to a variable for better readability
// const user = router;

// Middleware setup
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(morgan("tiny")); // Use Morgan for request logging

// GET: Route to return all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// POST: Route to add a new user to the database
app.post("/users", async (req, res) => {
  const { name, age } = req.body;

  try {
    const newUser = new User({ name, age });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
});

// PUT: Route to edit a user by ID in the database
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, age },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

// DELETE: Route to delete a user by ID in the database
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// Define a basic route for the root endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const connectDB = async function () {
  try {
    await mongoose.connect(url);
    console.log("Connection to MongoDB successful");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

// Start the application
const startApp = async () => {
  try {
    // Connect to the MongoDB database
    await connectDB();

    // Start the Express server
    app.listen(port, () => {
      console.log(
        `Server started at http://localhost:${port} and Connected to MongoDB `
      );
    });
  } catch (error) {
    console.log(error);
  }
};

// Call the function to start the application
startApp();
