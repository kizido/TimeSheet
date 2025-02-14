require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.set("trust proxy", 1);
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: [process.env.CORS_ORIGIN_DEV, process.env.CORS_ORIGIN_PROD],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

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

const authRoutes = require("./authRoutes");
const sheetsRoutes = require("./sheetsRoutes");

app.use(authRoutes);
app.use(sheetsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
