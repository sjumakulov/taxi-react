const sjdb = require("../database/sjdb");



// retrive and return all users / retrive and return a single user:
exports.find = (req, res) => {};

// update a new identified user by id:
exports.update = (req, res) => {
  records[req.body.id - 1]["name"] = req.body.name;
  records[req.body.id - 1]["company"] = req.body.company;
  records[req.body.id - 1]["route"] = req.body.route;
  records[req.body.id - 1]["car_type"] = req.body.car_type;
  records[req.body.id - 1]["car_num"] = req.body.car_num;
  records[req.body.id - 1]["license_num"] = req.body.license_num;
  records[req.body.id - 1]["license_category"] = req.body.license_category;
  records[req.body.id - 1]["permission_num"] = req.body.permission_num;

  changed(
    records[req.body.id - 1],
    req.body,
    "permission_expire_date",
    "startDate_permission"
  );
  changed(
    records[req.body.id - 1],
    req.body,
    "contract_expire_date",
    "startDate_contract"
  );
  changed(
    records[req.body.id - 1],
    req.body,
    "polis_expire_date",
    "startDate_polis"
  );
  changed(
    records[req.body.id - 1],
    req.body,
    "gas_tank_expire_date",
    "startDate_gas_tank"
  );
  changed(
    records[req.body.id - 1],
    req.body,
    "checkup_expire_date",
    "startDate_checkup"
  );

  records[req.body.id - 1]["permission_expire_date"] =
    req.body.permission_expire_date;
  records[req.body.id - 1]["contract_expire_date"] =
    req.body.contract_expire_date;
  records[req.body.id - 1]["polis_expire_date"] = req.body.polis_expire_date;
  records[req.body.id - 1]["gas_tank_expire_date"] =
    req.body.gas_tank_expire_date;
  records[req.body.id - 1]["checkup_expire_date"] =
    req.body.checkup_expire_date;
  function changed(oldR, newR, deadLineKey, startDateKey) {
    if (oldR[deadLineKey] !== newR[deadLineKey]) {
      oldR[startDateKey] = new Date();
    }
  }
  sjdb.writeCSV(records, "active");
  exports.records = records;
};



