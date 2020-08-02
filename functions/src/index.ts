// Firebase Config
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const serviceAccount = require("./service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://console.firebase.google.com/project/api-of-empires-ii/database"
});

// Middleware - imports //
import * as express from 'express';
const app = express();

// CORS

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Model
const firestore = admin.firestore();

interface ICivilization {
  civID: number;
  name: string;
  bonus: string[];
  uniqueUnits: string[];
  castleAgeTech: string;
  imperialAgeTech: string;
  teamBonus: string
  dateModified: number[];
}

class Civilizations {
  civID: string;
  name: string;
  bonus: string[];
  uniqueUnits: string[];
  castleAgeTech: string;
  imperialAgeTech: string;
  teamBonus: string;
  dateModified: number[];
  constructor(data: ICivilization) {
    this.civID = data.civID ? data.civID.toString() : "TEMP" + (Math.trunc(Math.random() * 10000000000)).toString();
    this.name = data.name;
    this.bonus = data.bonus;
    this.uniqueUnits = data.uniqueUnits;
    this.castleAgeTech = data.castleAgeTech;
    this.imperialAgeTech = data.imperialAgeTech;
    this.teamBonus = data.teamBonus;
    this.dateModified = [];
  }
  static async findAll() {
    const results = await firestore.collection("civilizations").get()
      .then(data => data.docs.map(doc => doc.data()))
      .catch(error => "Sorry, we encountered an error. " + error);
    return results;
  }

  async save() {
    const civilization = { ...this };
    this.dateModified.push(Date.now());
    const results = await firestore.collection("civilizations").doc(civilization.civID).set(civilization)
      .then(result => result.writeTime)
      .catch(error => console.log(error)
      );
    return results;
  }
}

// Controller

// import { Civilizations } from '../models/civilizations.model'

// FindAll
// Gets all AoEIIHD civilizations

const index = async (request: express.Request, response: express.Response) => {
  const civilizations = await Civilizations.findAll()
    .catch(error => console.log(error));
  response.status(200).send({ message: "Request successful.", civilizations });
};

// Create
// Creates a new civilization (Only use for adding on ad-hoc civs from expansion packs).

const create = async (request: express.Request, response: express.Response) => {
  const newCivilization = new Civilizations(request.body);
  const writeData = await newCivilization.save()
    .catch(error => console.log(error));
  response.status(200).send({ message: "Civilization successfully created in database. Firebase timestamp: " + writeData });
};


// Router

// import * as civilizations from "../controllers/civilizations.controller"

const router = express.Router();
// api - of - empires - ii / us - central1 / rogan
router.get('/api/civilizations', index);
router.post('/api/civilizations', create);

// export default router;

// Middleware - setup //
app.use('/', router);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server is listening on port ${port}.`));

exports.rogan = functions.https.onRequest(app);