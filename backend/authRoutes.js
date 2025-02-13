const express = require("express");
const router = express.Router();
const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcrypt");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Utility function to get the users collection
// async function getUsersCollection() {
//   await client.connect();
//   return client.db("time-sheet-db").collection("users");
// }

// Signup endpoint
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const users = client.db("time-sheet-db").collection("users");
    const existingUser = await users.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // Hash the password before saving (for security)
    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({ username, password: hashedPassword });

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const users = await client.db("time-sheet-db").collection("users");
    const user = await users.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
