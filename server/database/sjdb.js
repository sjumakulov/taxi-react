const fs = require("fs");
var csvsync = require("csvsync"); // to read CSV
const csvWriterModule = require("csv-writer"); // to write CSV
const replace = require("replace-in-file"); // to update a line in CSV

// Reading all records from persons.csv:========================
exports.readCSV = () => {
  let fileExists = fs.readdirSync("database").includes("persons.csv");
  let fileSize = fileExists ? fs.statSync("database/persons.csv").size : 0;

  if (fileExists && fileSize) {
    var csv = fs.readFileSync("database/persons.csv");
    var data = csvsync.parse(csv, {
      skipHeader: false,
      returnObject: true,
      delimiter: ",",
      trim: true,
    });
    return data;
  } else {
    return [];
  }
};
//==============================================================

// Appending one record to persons.csv:========================
const createCsvWriter = csvWriterModule.createObjectCsvWriter;

exports.appendToCSV = (object) => {
  let fileExists = fs.readdirSync("database").includes("persons.csv");
  let fileSize = fileExists ? fs.statSync("database/persons.csv").size : 0;

  const csvWriter = createCsvWriter({
    path: "database/persons.csv",
    header: Object.keys(object).map((key) => {
      return { id: key, title: key };
    }), // headers of csv
    append: fileExists && fileSize ? true : false,
  });
  csvWriter
    .writeRecords([object]) // returns a promise
    .then(() => {
      console.log("...Done");
    });
};
//==============================================================

// Update one record in persons.csv:============================
exports.updateRecordInCSV = (oldRecordObject, updatedRecordObject) => {
  const old_stringifiedObject = stringifyCSV(oldRecordObject);
  const updated_stringifiedObject = stringifyCSV(updatedRecordObject);

  const options = {
    files: "database/persons.csv",
    from: old_stringifiedObject,
    to: updated_stringifiedObject,
  };

  replace(options, (error, results) => {
    if (error) {
      return console.error("Error occurred:", error);
    }
    console.log("Replacement results in persons.CSV:", results);
  });
};
//==============================================================

// Remove a line from CSV:=====================================
exports.deleteRecordInCSV = (recordObject) => {
  const stringifiedObject = stringifyCSV(recordObject);

  const options = {
    files: "database/persons.csv",
    from: stringifiedObject,
    to: "",
  };

  replace(options, (error, results) => {
    if (error) {
      return console.error("Error occurred:", error);
    }
    console.log("Delete results in persons.CSV:", results);
  });
};
//==============================================================

// CSV Stringifier:=============================================
const createCsvStringifier = csvWriterModule.createObjectCsvStringifier;
function stringifyCSV(object) {
  const csvStringifier = createCsvStringifier({
    header: Object.keys(object).map((key) => {
      return { id: key, title: key };
    }),
  });
  const records = [object];

  return csvStringifier.stringifyRecords(records);
}
//==============================================================

// JSON file manipulation functions:
// Read whole JSON file: ==========================
exports.readJSON = (fileName) => {
  let folder = "database/";

  let fileExists = fs.readdirSync(folder).includes(fileName);
  let fileSize = fileExists ? fs.statSync(folder + fileName).size : 0;

  if (fileExists && fileSize) {
    let data = fs.readFileSync(folder + fileName, {
      encoding: "utf8",
      flag: "r",
    });
    data = JSON.parse(data);
    return data;
  } else {
    return {};
  }
};
// ===================================================

//write whole JSON:========================================
exports.writeJSON = (object, fileName) => {
  let folder = "database/";

  let stringifiedObject = JSON.stringify(object);

  try {
    fs.writeFileSync(folder + fileName, stringifiedObject, "utf8");
  } catch (err) {
    console.log(err);
  }
};
// =================================================
