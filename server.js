// Importing external packages - CommonJS
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dataAccessLayer = require("./dataAccessLayer");
const { ObjectId, ObjectID } = require("mongodb");
// ObjectID -  a constructor for creating an objectId
// that's part of a query

//ObjectID - a static object with utility functions
// Like is valid()

dataAccessLayer.connect();

// Creating my Server
const app = express();

// Installing the CORS middleware
// allows us (the server) to respond to
// requests from a different origin (URL)
// than the server.
app.use(cors());

// Installing the body-parser middleware
// Allow us to read JSON form requests
app.use(bodyParser.json());

// // Read in JSON FILE (mock database)
// let products = [];

// try {
//   products = JSON.parse(fs.readFileSync("products.json")).products;
// } catch (error) {
//   console.log("No existing file.");
// }

// Defining our HTTP Resource Methods
// API Endpoints / Routes

// GET ALL PRODUCTS
// GET /api/products
app.get("/api/products", async (request, response) => {
  const products = await dataAccessLayer.findAll();

  response.send(products);
});

// Get a Specifiic product by ID
// get /api/products/:id
app.get("/api/products/:id", async (request, response) => {
  const productId = request.params.id;

  if (!ObjectID.isValid(productId)) {
    response.status(400).send(`ProductID ${productId} is incorrect.`);
    return;
  }

  const productQuery = {
    _id: new ObjectId(productId),
  };

  let product;

  try {
    product = await dataAccessLayer.findOne(productQuery);
  } catch (error) {
    response.status(404).send(`Product with id ${productId} not found!`);
    return;
  }
  response.send(product);
});
// Create a New Product
// Post /api/products { id: 123, name: `apples`, price: 1.99}
app.post("/api/products", async (request, response) => {
  const body = request.body;

  // Validate the json body to have required properties
  // Required Properties:
  // -name
  // -price
  // -category

  if (!body.name || !body.price || !body.category) {
    response
      .status(400)
      .send(
        "Bad Request. Validation Error. Missing name, price (and greater than 0), category!"
      );
    return;
  }

  // Validate data types of properties
  // name => non-empty string
  // price => Greater than 0 Number
  //  category => non-empty string
  if (typeof body.name !== "string") {
    response.status(400).send("The name parameter must be of type string");
    return;
  }

  if (typeof body.category !== "string") {
    response.status(400).send("The category parameter must be of type string");
    return;
  }

  if (isNaN(Number(body.price))) {
    response.status(400).send("The price parameter must be of type number");
    return;
  }

  await dataAccessLayer.insertOne(body);

  response.status(201).send();
});

// Update exisiting product by ID
// PUT /api/products/:id {name: `apples`, price: 4.99, category}

app.put("/api/products/:id", async (request, response) => {
  const productId = request.params.id;
  const body = request.body;

  if (!ObjectID.isValid(productId)) {
    response.status(400).send(`ProductID ${productId} is incorrect.`);
    return;
  }
  if (body.name && typeof body.name !== "string") {
    response.status(400).send("The category parameter must be of type string");
    return;
  }

  if (body.category && typeof body.category !== "string") {
    response.status(400).send("The category parameter must be of type string");
    return;
  }

  if (body.price && isNaN(Number(body.price))) {
    response.status(400).send("The price parameter must be of type number");
    return;
  }

  const productQuery = {
    _id: new ObjectId(productId),
  };
  try {
    await dataAccessLayer.updateOne(productQuery, body);
  } catch (error) {
    response.status(404).send(`Product with id ${productId} not found!`);
  }

  response.send();
});

// Delete existing product by id
// Delete /api/products/:id
app.delete("/api/products/:id", async (request, response) => {
  const productId = request.params.id;

  if (!ObjectID.isValid(productId)) {
    response.status(400).send(`ProductID ${productId} is incorrect.`);
    return;
  }

  const productQuery = {
    _id: new ObjectId(productId),
  };

  try {
    await dataAccessLayer.deleteOne(productQuery);
  } catch (error) {
    response.status(404).send(`Product with id ${productId} not found!`);
    return;
  }
  response.send();
});

// Starting my Server
const port = process.env.Port ? process.env.Port : 3005;
app.listen(port, () => {
  console.log("Grocery API Server Started!");
});
