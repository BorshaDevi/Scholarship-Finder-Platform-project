const express=require('express')
const app=express()
require('dotenv').config()
const bcrypt = require('bcryptjs')
const cors=require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port=process.env.PORT || 5000

app.use(express.json())
app.use(cors())



const uri = process.env.DATABASE_URL

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const usersCollection=client.db('ScholarshipFinder').collection('users')


app.post('/users',async(req,res) =>{
  const user=req.body
  const password=user.password
  const pass=bcrypt.hashSync(password , 10)
  const allUsersData={
    name:user.name,
    email:user.email,
    password:pass,
    role:user.role

  }
  const result=await usersCollection.insertOne(allUsersData)
  res.send(result)
})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/',(req,res)=>{
    res.send('Server is running ')
})
app.listen(port , () =>{
    console.log(`Server is running ${port}`)
})