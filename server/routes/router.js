const express = require("express");
const { getRecords } = require("../controllers/get");
const { deletePerson } = require("../controllers/delete");
const {
  createPerson,
  createCompany,
  createPayTransaction,
} = require("../controllers/post");

const route = express.Router();

// API:
// get all records from database:
route.get("/", getRecords);

// create one record to database:
route.post("/persons", createPerson);

// create one COMPANY in companies.json:
route.post("/companies", createCompany);

// create pay transaction in payment_history.json & payment_status:
route.post("/pay", createPayTransaction);

// remove one person:
route.delete("/persons/", deletePerson);

// // update one record in database:
// route.put("/records/:id", controller.update);




// we are exporting our route const so that we can call it from our server.js
module.exports = route;

