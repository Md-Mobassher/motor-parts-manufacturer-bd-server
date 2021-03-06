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
    const toolCollection = client.db('motor-parts').collection('tools');
    const reviewCollection = client.db('motor-parts').collection('reviews');
    const orderCollection = client.db('motor-parts').collection('orders');

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
      app.get('/tool', async (req, res) => {
        const query = {};
        const cursor = toolCollection.find(query);
        const tools = await cursor.toArray();
        res.send(tools);
    });

     // get tool details api
     app.get('/tool/:id', verifyJWT, async(req, res) =>{
       const id = req.params.id;
       const query = {_id: ObjectId(id)}; 
       const tool = await toolCollection.findOne(query);
       res.send(tool);
     })

     // post tool api
     app.post('/tool',verifyJWT, verifyAdmin, async (req, res) => {
      const newTool = req.body;
      const result = await toolCollection.insertOne(newTool);
      res.send(result);
  });

      // DELETE tool api
      app.delete('/tool/:id', verifyJWT, verifyAdmin, async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await toolCollection.deleteOne(query);
        res.send(result);
    });


     
      // get all user api
    app.get('/user', verifyJWT, verifyAdmin, async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });
     
     // DELETE user api
     app.delete('/user/:email', verifyJWT, verifyAdmin, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.deleteOne(query);
      res.send(result);
  });


      // get all order api
    app.get('/order', verifyJWT, verifyAdmin, async (req, res) => {
      const orders = await orderCollection.find().toArray();
      res.send(orders);
    });

    // update user
    app.put('/user/email',verifyJWT, async(req, res) =>{
      const email = req.params.email;
      const updatedUser = req.body;
      const filter = {email: email};
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
              name: updatedUser.name,
              email: updatedUser.email,
              phone: updatedUser.phone,
              address: updatedUser.address,
              linkedin: updatedUser.linkedin
          }
      };
      const result = await userCollection.updateOne(filter, updatedDoc, options);
      res.send(result);

  })


       // make an admin api
    app.put('/user/admin/:email', verifyJWT ,verifyAdmin,  async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updateDoc = {
        $set: { role: 'admin' },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

     
    // get all admin api
    app.get('/admin/:email', verifyJWT, async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user.role === 'admin';
      res.send({ admin: isAdmin })
    })


    // get all reviews api
    app.get('/review', async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

     // post review api
     app.post('/review',verifyJWT, async (req, res) => {
      const newReview = req.body;
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
     });





     // get specific order
    app.get('/order/:email', verifyJWT, async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const orders = await orderCollection.find(query);
        res.send(orders)
    })

     // post order api
     app.post('/order',verifyJWT, async (req, res) => {
      const newOrder = req.body;
      const result = await orderCollection.insertOne(newOrder);
      res.send(result);
     });

     // DELETE order api
     app.delete('/order/:id', verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
  });


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