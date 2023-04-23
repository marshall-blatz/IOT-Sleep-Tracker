const express = require("express");
const path = require('path');
const admin = require('firebase-admin');

const PORT = process.env.PORT || 3001;
const app = express();

// Load the service account key JSON file
const serviceAccount = require('./iot-project-c5c33-firebase-adminsdk-i14q4-165d727969.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://iot-project-c5c33-default-rtdb.firebaseio.com"
});

// Get a reference to the Firestore database
const db = admin.firestore();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/public')));
app.use(express.json())

// Route for getting data from firestore
// app.get('/api/data/:id', (req, res) => {
//     const docId = req.params.id;
//     const docRef = db.collection('data').doc(docId);
  
//     docRef.get()
//       .then(doc => {
//         if (doc.exists) {
//           res.json(doc.data());
//         } else {
//           res.status(404).json({ error: 'Document not found' });
//         }
//       })
//       .catch(error => {
//         res.status(500).json({ error: error.message });
//       });
//   });
  
  // Route for setting data in firestore
  // app.post('/api/data', (req, res) => {
  //   const newData = req.body;
  
  //   db.collection('data').add(newData)
  //     .then(docRef => {
  //       res.json({ id: docRef.id });
  //     })
  //     .catch(error => {
  //       res.status(500).json({ error: error.message });
  //     });
  // });

// Handle GET requests to the /api route
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});