const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsu8oow.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const tshartCollection = client
      .db("ecomerce-Database")
      .collection("tshart");

      // Get
    app.get("/tsharts", async (req, res) => {
      const query = {};
      const cursor = tshartCollection.find(query);
      const tsharts = await cursor.toArray();
      res.send(tsharts);
    });

    app.get("/tsharts/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const tshart = await tshartCollection.findOne(query);
      res.send(tshart);
    });
    
    // Post

    app.post("/tsharts", async(req, res) => {
      const newProduct = req.body;
      const result = await tshartCollection.insertOne(newProduct);
      res.send(result);
    })
    
    // Delete
    app.delete("/tsharts/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const tshart = await tshartCollection.deleteOne(query);
      res.send(tshart);
    })


  } finally {

  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running ecomerce server");
});

app.listen(port, () => {
  console.log("listen to port", port);
});
