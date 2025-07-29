import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";
import { admin } from "./firebase/firebaseAdmin.js";

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

    const userCollection = client.db("AuthenticationDB").collection("Users");

    // set users on db
    app.post("/users", async (req, res) => {
      // insert user email if user doesnt exist
      const query = { email: req.body.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User Already exist", insertedId: null });
      }
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send({ success: true });
    });



    // get all users from firebase 
app.get("/firebase-users", async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map(userRecord => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || null,
      emailVerified: userRecord.emailVerified,
      photoURL: userRecord.photoURL || null,
      providerId: userRecord.providerData.length > 0 ? userRecord.providerData[0].providerId : "password",
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
    }));
    res.status(200).json(users);
  } catch (error) {
    console.error("Error listing Firebase users:", error);
    res.status(500).send({ message: "Failed to get Firebase users" });
  }
});

  //Remove user 
  // Delete user by email (or any unique field)
// Delete user from Firebase Auth by UID
app.delete("/firebase-users/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    await admin.auth().deleteUser(uid);
    res.status(200).send({ success: true, message: "User deleted from Firebase Auth" });
  } catch (error) {
    console.error("Error deleting Firebase user:", error);
    res.status(500).send({ success: false, message: "Failed to delete Firebase user" });
  }
});





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
