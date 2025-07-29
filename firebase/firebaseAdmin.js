import admin from "firebase-admin";
import fs from "fs";

// ✅ Replace with your actual JSON file name and path
const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("./authentication-app-22a68-firebase-adminsdk-fbsvc-5b22f78139.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export { admin };
