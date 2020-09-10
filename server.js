const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

const app = express();

// I believe the CORS stuff will eventually be used for Backend-Frontend communication
// Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources on a web page to be
// requested from another domain outside the domain from which the first resource was served.
// This basically means our APIs are on a secret domain that clients cannot access, but the application itself can.
const corsOptions = { // was var
    origin: "http://localhost:3000"
};
app.use(cors(corsOptions));

// Makes it more difficult for users to see we are running express. Helps against targeted attacks.
app.disable('x-powered-by');

// Express middleware that allows POSTing data
// -parse requests of content-type - application/json
app.use(express.json());
// -parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");

// This is just a test. Should be changed to serve up the homepage.
app.get("/", (req, res) => {
    res.json({message: "Welcome to PetRecs"});
})

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '/client/public/')));

// An api endpoint that returns a short list of items
/*app.get('/', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});*/

// Handles any requests that don't match the ones above
/*app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});*/

const apiPet = require('./routes/pet.routes');
app.use('/api/pets', apiPet);

const apiPetWeight = require('./routes/pet-weight.routes');
app.use('/api/pet-weights', apiPetWeight);

const apiAccount = require('./routes/account.routes');
app.use('/api/accounts', apiAccount);

const apiPetEvent = require('./routes/pet-event.routes');
app.use('/api/pet-events', apiPetEvent);

const PORT = process.env.PORT || 5000;

// Create the tables if they do not exist (and do nothing if they already exist)
db.sequelize.sync().then(() => {
    // Only start the server if a connection to the DB has been made
    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}.`);
    })
})


