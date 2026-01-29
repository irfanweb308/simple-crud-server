const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

//pass: H9JwMa9qk1pbxHUr

const uri = "mongodb+srv://simpleDBUser:H9JwMa9qk1pbxHUr@cluster0.tsxr6dp.mongodb.net/?appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

    await client.connect();

    const database = client.db("userDB");
    const usersCollection = database.collection("users");

    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    app.post('/users', async (req, res) => {
      console.log("data in server", req.body);
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result  = await usersCollection.deleteOne(query);
      res.send(result);
    });  

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged deployment. You successfully connected to MongoDB!");
  }
  finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Simple crud server running');
});

app.listen(port, () => {
  console.log(`Server is running on  ${port}`);
});