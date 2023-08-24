const express = require('express')
const app = express()
const port = process.env.PORT || 8000;
require('dotenv').config()
//middle were
const cors = require('cors')
app.use(cors())

//data post korla middlewere
app.use(express.json()) 

//MongoDb Part Crud server
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mongodb-1.dicfjcd.mongodb.net/?retryWrites=true&w=majority`;

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
        //this line is important
        await client.connect();
   
      const database = client.db("Crud-Server");
      const NewStudentsCollection = database.collection("NewStudentsCollection");
      
      //post-1 method
      app.post('/users',async(req,res)=>{
        const newUser = req.body;
        const result = await NewStudentsCollection.insertOne(newUser)
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.json(result);
      })
      //get-2 data Find operation
      app.get('/users',async(req,res)=>{
        const cursor= NewStudentsCollection.find({})
        const user = await cursor.toArray();
        res.send(user);
      })


      //delete-3 api
      app.delete('/users/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await NewStudentsCollection.deleteOne(query);
        res.json(result);
      })

      //get-4 api singls users view and update
      app.get('/users/:id',async(req,res)=>{ 
        const id = req.params.id; 
        const query = {_id : new ObjectId(id)}
        const result = await NewStudentsCollection.findOne(query)
        res.send(result);
      })
      //Update-5 Api
      app.put('/users/:id',async(req,res)=>{
        const id = req.params.id;
        const updatedUsers = req.body;
        const filter = {_id : new ObjectId(id)}
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            name:updatedUsers.name,
            email: updatedUsers.email
          },
        };

        const result = await NewStudentsCollection.updateOne(filter, updateDoc, options);
        res.json(result)
      })

    } finally {
        //this is comment because data not send data base;
    //   await client.close();
    }
  }
  run().catch(console.dir);


// //MongoDb Part multlple data pass
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://express:TVhDetqut7bz4hyU@mongodb-1.dicfjcd.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//     try {
//         const database = client.db("Express");
//         const foods = database.collection("foods");
//         // create a document to insert
//         const docs = [
//             { name: "cake", healthy: false },
//             { name: "lettuce", healthy: true },
//             { name: "donut", healthy: false }
//           ];

//         const options = { ordered: true };  
//         const result = await foods.insertMany(docs, options);
//         console.log(`${result.insertedCount} documents were inserted`);      
//     }finally {
//         await client.close();
//       }
// }
// run().catch(console.dir);

// normal part
/* 
const users =[
{
id:0,
name:"Rahat",
email:"rahat@gmail.com"
},
{
id:1,
name:"Masum",
email:"Masum@gmail.com"
},
{
id:2,
name:"Korim",
email:"Korim@gmail.com"
}
]


//here get users object data;
// app.get('/users',(req,res)=>{
//     res.send(users)
// })

//users/id data check
app.get('/users/:id',(req,res)=>{
    const id = req.params.id;
    const user = users[id];
    res.send(user);
})
//users/qurery parameter using search;
app.get('/users',(req,res)=>{
    const seacrh = req.query.name;
    const filter = users.filter(user =>
        (user.name.includes(seacrh))
    )
//    res.send(filter);
{
    seacrh? res.send(filter) : res.send(users)
}
})
*/


app.get('/', (req, res) => {
    res.send(`<h1>Welcome Rahat!</h1>`)
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})