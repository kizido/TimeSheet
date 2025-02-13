require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic routes
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

// Import and use authentication routes
const authRoutes = require("./authRoutes");
app.use(authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
