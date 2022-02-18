const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");

const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 5090;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Get your backend data by using this!!!!!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjzaj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("connection error: ", err);

  const cameraCollection = client.db("gadgefy").collection("CameraData");
  const adminCollection = client.db("gadgefy").collection("admin");
  const sellCameraCollection = client.db("gadgefy").collection("sellCamera");
  const getValueCollection = client.db("gadgefy").collection("getValue");
  // perform actions on the collection object

  app.get("/addAdmin", (req, res) => {
    // console.log('from query ',req.query.email);
    adminCollection.find({ email: req.query.email }).toArray((err, admin) => {
      res.send(admin);
      console.log(err, admin);
    });
  });
  app.post("/addAdmin", (req, res) => {
    const newAdmin = req.body;
    console.log(newAdmin);
    adminCollection.insertOne(newAdmin).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/isAdmin", (req, res) => {
    // console.log(req.body.email);
    adminCollection.find({ email: req.body.email }).toArray((err, admin) => {
      res.send(admin.length > 0);
    });
  });

  app.get("/addCameras", (req, res) => {
    cameraCollection.find().toArray((error, items) => {
      res.send(items);
    });
  });

  app.get("/addCamera/:id", (req, res) => {
    cameraCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((error, items) => {
        res.send(items);
      });
  });

  app.delete("/deleteCamera/:id", (req, res) => {
    cameraCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  app.post("/addCameras", (req, res) => {
    const newCameras = req.body;
    console.log("adding new cameras", newCameras);
    cameraCollection.insertOne(newCameras).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/sellCameras", (req, res) => {
    sellCameraCollection.find().toArray((error, contents) => {
      res.send(contents);
    });
  });

  app.post("/sellCameras", (req, res) => {
    const newSellCameras = req.body;
    console.log("selling new cameras", newSellCameras);
    sellCameraCollection.insertOne(newSellCameras).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/getValues", (req, res) => {
    getValueCollection.find().toArray((error, value) => {
      res.send(value);
    });
  });

  app.get("/getValue/:id", (req, res) => {
    getValueCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((error, items) => {
        res.send(items);
      });
  });

  app.delete("/deleteValue/:id", (req, res) => {
    getValueCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  app.post("/getValues", (req, res) => {
    const newGetValue = req.body;
    console.log("selling new cameras", newGetValue);
    getValueCollection.insertOne(newGetValue).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  //   client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
