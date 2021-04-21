const axios   = require("axios");
const body    = require('body-parser');
const cors    = require("cors");
const express = require("express");
const fs      = require("fs");
const secrets = require('dotenv').config();
const sqlite3 = require("sqlite3").verbose();

// * * * These functions help set up express

// Allows for local https on top of express
const app = require("https-localhost")();

app.use(body.urlencoded({ extended: true }));
app.use(body.json())
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static("public"));

// * * * These functions set up sqlite

const dbFile = "./data/sqlite.db";
const exists = fs.existsSync(dbFile);
const db = new sqlite3.Database(dbFile);

// Create new database (if it doesn't exist already)
db.serialize(() => {
  console.log("Running serialize db")
  if (!exists) {
    db.run(
      "CREATE TABLE Logs (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, user_id TEXT, logs TEXT)"
    );
    console.log("Logs database created");
  } else { console.log('Logging is already ready'); }
});


// * * * These functions control routing

// Loads the main pages, located in the /views folder
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});
app.get("/administrator", (request, response) => {
  response.sendFile(`${__dirname}/views/administrator.html`);
});

// If your app isn't running, make sure "DAILY_API=your-code-here"
// in your .env file (in the root directory) 
const API_AUTH = process.env.DAILY_API;
const BASE_URL = "https://api.daily.co/v1/";

// The axios library helps create asynchronous HTTP requests
const dailyApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json", 'Authorization': 'Bearer '+API_AUTH },
  timeout: 3000, // this is equal to 3 seconds
});



// get list of existing rooms
app.get("/rooms", async (request, response) => {
  try {
    const rooms = await apiBuilder("get", "/rooms");
    response.json(rooms);
  } catch (e) {
    console.log("error: ", e);
    response.status(500).json({ error: e.message });
  }
});

// create a new room
app.post("/make-room", async (request, response) => {
  try {
    const rooms = await apiBuilder("post", "/rooms", request.body);
    response.json(rooms);
  } catch (e) {
    console.log("error: ", e);
    response.status(500).json({ error: e.message });
  }
});

// log data from client
app.post("/log-data", async (request, response) => {
  try {
      console.log(request.body.user_id);
      db.run(`INSERT INTO Logs (session_id, user_id, logs) VALUES (?, ?, ?)`, 
        request.body.session_id, request.body.user_id, request.body.logs, 
        error => {
          if (error) {
            response.send({ message: "Sorry, there was a problem writing to the database!" });
          } else {
            response.send({ message: "success" });
          }
      });
  } catch (e) {
    console.log("error: ", e);
    response.status(500).json({ error: e.message });    
  }

})


// * * * These functions are helper methods

const apiBuilder = async (method, endpoint, body = {}) => {
  try {
    const response = await dailyApi.request({
      method: method,
      url:    endpoint,
      data:   body
    });
    return response.data;
  } catch (error) {
    console.log("Error status: ", error.response.status);
    console.log("Error message: ", error.response.statusText);
    document.getElementById("error").innerText = "You found a bug!";
    throw new Error(error);
  }
};

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

