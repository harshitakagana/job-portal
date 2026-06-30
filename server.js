// Import required packages
const express = require("express");
const cors = require("cors");

// Create an Express application
const app = express();

// Middleware: allows frontend (different port) to talk to this backend
app.use(cors());

// Middleware: allows our server to understand JSON data sent in requests
app.use(express.json());

// A simple test route to confirm the server is working
app.get("/", (req, res) => {
  res.send("CareerConnect backend is running!");
});

// Define the port the server will listen on
const PORT = 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
