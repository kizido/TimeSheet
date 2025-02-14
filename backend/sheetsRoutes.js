require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const crypto = require("crypto");

const router = express.Router();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWT_SECRET =
  process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");

router.get("/sheets", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }

  const userId = user.userId;
  if (!userId) {
    return res.status(401).json({ message: "Invalid user token." });
  }

  try {
    await client.connect();
    const sheets = await client
      .db("time-sheet-db")
      .collection("sheets")
      .find({ userId })
      .sort({ updatedAt: -1, createdAt: -1 })
      .toArray();
    res.status(200).json({ sheets });
  } catch (error) {
    console.error("Error fetching sheets:", error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    await client.close();
  }
});

router.post("/sheets", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }

  const userId = user.userId;
  if (!userId) {
    return res.status(401).json({ message: "Invalid user token." });
  }

  const {
    sheetName,
    description,
    rate,
    minutesEntries,
    totalMinutes,
    totalCost,
  } = req.body;
  if (!sheetName) {
    return res.status(400).json({ message: "Sheet name is required." });
  }

  try {
    const sheet = {
      userId,
      sheetName,
      description,
      rate,
      minutesEntries,
      totalMinutes,
      totalCost,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await client.connect();
    const result = await client
      .db("time-sheet-db")
      .collection("sheets")
      .insertOne(sheet);
    res.status(201).json({
      message: "Sheet created successfully.",
      sheetId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating sheet:", error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    await client.close();
  }
});

router.put("/sheets/:id", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }

  const userId = user.userId;
  if (!userId) {
    return res.status(401).json({ message: "Invalid user token." });
  }

  const sheetId = req.params.id;
  const {
    sheetName,
    description,
    rate,
    minutesEntries,
    totalMinutes,
    totalCost,
  } = req.body;
  if (!sheetName) {
    return res.status(400).json({ message: "Sheet name is required." });
  }

  try {
    await client.connect();
    const result = await client
      .db("time-sheet-db")
      .collection("sheets")
      .updateOne(
        { _id: new ObjectId(sheetId), userId },
        {
          $set: {
            sheetName,
            description,
            rate,
            minutesEntries,
            totalMinutes,
            totalCost,
            updatedAt: new Date(),
          },
        }
      );
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Sheet not found or no changes made." });
    }
    res.status(200).json({ message: "Sheet updated successfully." });
  } catch (error) {
    console.error("Error updating sheet:", error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    await client.close();
  }
});

module.exports = router;
