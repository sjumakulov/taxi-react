const { getData } = require("./functions");

// get all records from the data files:======================
exports.getRecords = function (req, res) {
  res.json(
    getData([
      "persons",
      "payment_history",
      "payment_status",
      "cars",
      "companies",
      "other",
    ])
  );
};
