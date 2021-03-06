const mongoose = require("mongoose");
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const dotenv = require("dotenv");
const Pothole = require("./location");
const bodyParser = require("body-parser");

const cors = require("cors");
app.use(cors());
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR!!!!");
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));
app.use(bodyParser.json());

app.get("/pothole", async (req, res) => {
  const pothole = await Pothole.find({});
  res.send(pothole);
});

app.post("/pothole", async (req, res) => {
  const newPothole = new Pothole(req.body);
  await newPothole.save();
  res.send(req.body);
});

app.get("/pothole/:id", async (req, res) => {
  const { id } = req.params;
  const pothole = await Pothole.findById(id);
  res.send(pothole);
});

app.put("/pothole/:id", async (req, res) => {
  const { id } = req.params;
  const pothole = await Pothole.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.send("done");
});

app.delete("/pothole/:id", async (req, res) => {
  const { id } = req.params;
  const deletedPothole = await Pothole.findByIdAndDelete(id);
  res.send("done");
});

// new route

const kmToRadian = (km) => {
  const earthRadiusInKm = 6378;
  return km / earthRadiusInKm;
};

app.get("/potholeByDistance", async (req, res) => {
  const { lat, long } = req.query;
  const distance = 0.1;

  const query = {
    location: {
      $geoWithin: {
        $centerSphere: [[long, lat], kmToRadian(distance)],
      },
    },
  };

  const pothole = await Pothole.find(query);

  res.send(pothole);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("APP IS LISTENING ON PORT 3000!");
});
