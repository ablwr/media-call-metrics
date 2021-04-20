const axios   = require("axios");
const cors    = require("cors");
const express = require("express");
const secrets = require('dotenv').config();

// Allows for local https on top of
const app = require("https-localhost")();

// For cross-origin requests
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(express.json());
app.use(express.static("public"));

// Loads the main page, located in the /views folder
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});


// If your app isn't running, make sure "DAILY_API=your-code-here"
// in your .env file (in the root directory) 
const API_AUTH = process.env.DAILY_API;
const BASE_URL = "https://api.daily.co/v1/";

// The axios library helps create asynchronous HTTP requests
const dailyApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Authorization': 'Bearer '+API_AUTH },
  timeout: 3000, // this is equal to 3 seconds
});

// This helper function communicates with the Daily.co API
const apiBuilder = async (method, endpoint, body = {}) => {
  try {
    const response = await dailyApi.request({
      url:    endpoint,
      method: method,
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
app.post("/rooms", async (request, response) => {
  try {
    const rooms = await apiBuilder("post", "/rooms", request.body);
    response.json(rooms);
  } catch (e) {
    console.log("error: ", e);
    response.status(500).json({ error: e.message });
  }
});


// Just a reminder that everything is running, and where
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});



