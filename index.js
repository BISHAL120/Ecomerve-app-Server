const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

/* ecomerceapp */

/* gD18BuRY4RSm5nD1 */

const uri = `mongodb+srv://ecomerceapp:tj6pHJvLjs7MmX3D@cluster0.dsu8oow.mongodb.net/?retryWrites=true&w=majority`;

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

    app.get("/tsharts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const tshart = await tshartCollection.findOne(query);
      res.send(tshart);
    });

    // Post

    /*  app.post("/tsharts", async (req, res) => {
      const newProduct = req.body;
      const result = await tshartCollection.insertOne(newProduct);
      res.send(result);
    }); */

    app.post("/tsharts", async (req, res) => {
      const newProduct = req.body;
      newProduct.createdAt = new Date();

      // Step 1: Retrieve current documents in the collection
      const existingProducts = await tshartCollection.find().toArray();

      // Step 2: Insert the new document at the beginning
      existingProducts.unshift(newProduct);

      // Step 3: Update the collection with the new order
      await tshartCollection.deleteMany({}); // Remove all existing documents
      await tshartCollection.insertMany(existingProducts); // Insert the updated documents

      res.send({ success: true });
    });

    // Delete
    app.delete("/tsharts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const tshart = await tshartCollection.deleteOne(query);
      res.send(tshart);
    });
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
