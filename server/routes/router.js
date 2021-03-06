const express = require("express");
const { getRecords, download } = require("../controllers/get");
const { deletePerson } = require("../controllers/delete");
const {
  updateCompany,
  updatePerson,
  updatePrice,
} = require("../controllers/put");

const {
  createPerson,
  createCompany,
  createPayTransaction,
} = require("../controllers/post");

const route = express.Router();

// API:
// get all records from database:
route.get("/", getRecords);

// download records in csv file:
route.get("/download", download);

// create one record to database:
route.post("/persons", createPerson);

// create one COMPANY in companies.json:
route.post("/companies", createCompany);

// create pay transaction in payment_history.json & payment_status:
route.post("/pay", createPayTransaction);

// remove one person:
route.delete("/person", deletePerson);

// update one person in database:
route.put("/person", updatePerson);

// update one company in database:
route.put("/company", updateCompany);

// update price in database:
route.put("/price", updatePrice);

// we are exporting our route const so that we can call it from our server.js
module.exports = route;
