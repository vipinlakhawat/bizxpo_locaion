const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

app.use(cors("*"));

const DB_CONNECT = process.env.MONGODB_CONNECTION;
mongoose.connect(DB_CONNECT);

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.get("/countries", async (req, res, next) => {
  try {
    const db = mongoose.connection.db;
    let data = await db.collection("countries").find().toArray();
    if (data) {
      res.status(200).send(data);
    }
  } catch (err) {
    res.status(500).send("internal Error");
  }
});

app.get("/state/:countryId", async (req, res, next) => {
  try {
    const db = mongoose.connection.db;
    let countryId = req.params.countryId;

    if (countryId) {
      countryId = +countryId;
    }
    if (isNaN(countryId)) {
      res.status(404).send("invalid country");
      return;
    }

    let data = await db.collection("states").find({ country_id: countryId }).toArray();

    res.send(data);
  } catch (err) {
    res.status(500).send("internal Error");
    return;
  }
});

app.get("/city/:stateId", async (req, res, next) => {
  try {
    const db = mongoose.connection.db;
    let stateId = req.params.stateId;

    if (stateId) {
      stateId = +stateId;
    }
    if (isNaN(stateId)) {
      res.status(404).send("invalid State");
      return;
    }

    let data = await db.collection("cities").find({ state_id: stateId }).toArray();
    res.send(data);
  } catch (err) {
    res.status(500).send("internal Error");
  }
});

app.listen(5400, () => {
  console.log("port listening on port 5400");
});
