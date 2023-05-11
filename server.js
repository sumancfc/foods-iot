const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

const port = 2908;

const uri =
  "mongodb+srv://singhsonali2908:Sonali2908@cluster0.txvrt5l.mongodb.net/ss_food?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useUnifiedTopology: true });
//connect to mongodb
async function run() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.log(err);
  }
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Sonali here");
});

// get all the foods
app.get("/foods", async (req, res) => {
  const foodItems = client.db("ss_food").collection("foods");

  const foodList = await foodItems.find().toArray();

  res.status(200).json(foodList);
});

// add food in the list
app.post("/food/add", async (req, res) => {
  const foodItems = client.db("ss_food").collection("foods");
  const { name, cuisine, category } = req.body;

  const food = await foodItems.insertOne({
    name,
    cuisine,
    category,
  });

  res.status(201).json({ message: "New food item has been added", food });
});

//get single food by id
app.get("/food/:id", async (req, res) => {
  const foodItems = client.db("ss_food").collection("foods");
  const { id } = req.params;

  const food = await foodItems.findOne({ _id: new ObjectId(id) });
  res.status(200).json(food);
});

// update food item using id
app.put("/food/:id", async (req, res) => {
  const foodItems = client.db("ss_food").collection("foods");
  const { id } = req.params;
  const updateFoodItem = req.body;

  const food = await foodItems.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateFoodItem }
  );

  res.status(200).json({ message: "Food item has been updated.", food });
});

// delete the food item using id
app.delete("/food/:id", async (req, res) => {
  const foodItems = client.db("ss_food").collection("foods");
  const { id } = req.params;

  await foodItems.deleteOne({ _id: new ObjectId(id) });
  res.status(200).json("Food item has been deleted.");
});

run().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
});
