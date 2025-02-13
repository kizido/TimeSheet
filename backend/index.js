require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Timesheet API Running");
});
app.get("/greet", (req, res) => {
  res.status(200).json({ greeting: "TEST YOU'VE REACHED THE SERVER" });
});

app.get("/testdb", async (req, res) => {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    const db = client.db("time-sheet-db");
    const { greeting } = await db
      .collection("greetings")
      .findOne({ type: "hello" });

    res.status(200).json({ greeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong with the server" });
  }
  client.close();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// app.post('/signup', async (req, res) => {
//   const { username, password } = req.body;

//   // Basic input validation
//   if (!username || !password) {
//     return res.status(400).json({ error: 'Username and password required' });
//   }

//   try {
//     // Check if the user already exists
//     const userExists = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert the new user into the database
//     const newUser = await pool.query(
//       "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
//       [username, hashedPassword]
//     );

//     res.status(201).json(newUser.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // User Login Route
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   // Basic input validation
//   if (!username || !password) {
//     return res.status(400).json({ error: 'Username and password required' });
//   }

//   try {
//     // Retrieve the user from the database
//     const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
//     if (userResult.rows.length === 0) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     const user = userResult.rows[0];

//     // Compare the provided password with the hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     res.json({ message: 'Login successful', user });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
