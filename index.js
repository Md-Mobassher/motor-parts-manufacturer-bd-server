const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pu5qw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  // verify jwt
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).send({ message: 'Forbidden access' })
      }
      req.decoded = decoded;
      next();
    });
}
  

async function run() {
  try {
    await client.connect();
    const userCollection = client.db('motor-parts').collection('users');
    const toolsCollection = client.db('motor-parts').collection('tools');

    const verifyAdmin = async (req, res, next) => {
      const requester = req.decoded.email;
      const requesterAccount = await userCollection.findOne({ email: requester });
      if (requesterAccount.role === 'admin') {
        next();
      }
      else {
        res.status(403).send({ message: 'forbidden' });
      }
    }


      // give an access token after login 
      app.put('/user/:email', async(req, res) =>{
        const email = req.params.email;
        const user = req.body;
        const filter = { email : email};
        const options = { upsert: true};
        const updateDoc = {
          $set: user,
        }
        const result = await userCollection.updateOne(filter, updateDoc, options);
        const token = jwt.sign({email:email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
        res.send({result, token})
      })
   
      // get all tools api
      app.get('/tools', async (req, res) => {
        const query = {};
        const cursor = toolsCollection.find(query);
        const tools = await cursor.toArray();
        res.send(tools);
    });

     // get tool details api
     app.get('/tools/:id',  async(req, res) =>{
       const id = req.params.id;
       console.log(id);
       const query = {_id: ObjectId(id)};
       const tool = await toolsCollection.findOne(query);
       res.send(tool);
     })
     
      // get all user api
    app.get('/user',  async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });


       // make an admin api
    app.put('/user/admin/:email', verifyJWT, verifyAdmin, async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updateDoc = {
        $set: { role: 'admin' },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })




    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})