import express from "express";
import cors from "cors";
import "dotenv/config";                    
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();                      
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.igawft7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const userCollection = client.db("AuthenticationDB").collection("Users")

    // set users on db 
    app.post("/users", async(req, res)=>{

      // insert user email if user doesnt exist 
      const query = {email : req.body.email}
      const existingUser = await userCollection.findOne(query)
      if(existingUser){
        return res.send({message: "User Already exist", insertedId: null})
      }
      const user = req.body
      const result = await userCollection.insertOne(user)
      res.send({success : true})
    })











    
    await client.db("admin").command({ ping: 1 });
    console.log("✅  MongoDB connected");
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
