const { appendToCSV, writeJSON } = require("../database/sjdb");
const {
  getData,
  getIDs,
  makeid,
  addPayHistStatus,
  addTransaction,
  updatePaymentStatus,
} = require("./functions");

// ! Add person info in the same order! //
// create one record in data files:==========================
exports.createPerson = (req, res) => {
  console.log("received data:", req.body)
  let car_id = req.body.car_num.replaceAll(" ", ""),
    company_id = req.body.company_id;

  if (!car_id || !company_id) {
    res.status(400).send("Car_num || company_id cannot be empty!");
    return;
  } else if (car_id && company_id) {
    let { companies } = getData(["companies"]);

    if (!companies[company_id]) {
      res.status(400).send("Company with this ID not found!");
    } else {
      let { cars } = getData(["cars"]);
      // getting IDs:
      let { IDs, car_IDs } = getIDs();

      // generating unique IDs:
      let person_id = makeid(20, IDs);

      // time now:
      let now = new Date().toLocaleString();

      // checking if main_driver exists or not:
      let currentCarID = req.body.car_num.replaceAll(" ", "");
      let carExists = car_IDs.includes(currentCarID);
      let carHasMainDriver = carExists ? cars[currentCarID].main_driver : false;

      // adding data to temporary object:
      let recordObject = {
        person_id: person_id,
        ...req.body,
        is_main_driver: eval(req.body.is_main_driver)
          ? !carHasMainDriver
          : false,
        med_start_date: now,
        polis_start_date: now,
        contract_start_date: now,
        permission_start_date: now,
        gas_tank_start_date: now,
        checkup_start_date: now,
        work_contract_start_date: now,
      };
      // writing this person to CSV:
      appendToCSV(recordObject);

      // writing to cars.json:
      if (carExists) {
        // opening payment history and status for main driver:
        if (eval(recordObject.is_main_driver)) {
          cars[currentCarID].main_driver = person_id;
          writeJSON(cars, "cars.json");
        } else {
          cars[currentCarID].other_drivers.push(person_id);
          writeJSON(cars, "cars.json");
        }
      } else if (!carExists) {
        // opening payment history and status for main driver:
        addPayHistStatus(car_id);
        if (eval(recordObject.is_main_driver)) {
          cars[currentCarID] = {
            main_driver: person_id,
            car_type: recordObject.car_type,
            other_drivers: [],
          };
          writeJSON(cars, "cars.json");
        } else {
          cars[currentCarID] = {
            main_driver: "",
            car_type: recordObject.car_type,
            other_drivers: [person_id],
          };

          writeJSON(cars, "cars.json");
        }
      }

      res.status(201).send("Record created!");
    }
  }
};

//createCompany==========================================
exports.createCompany = (req, res) => {
  if (!req.body.name || !req.body.color) {
    res.status(400).send("Name and Color cannot be empty!");
    return;
  }
  // getting IDs:
  let { IDs } = getIDs();

  // generating unique IDs:
  let company_id = makeid(20, IDs);

  let { companies } = getData(["companies"]);
  companies[company_id] = req.body;

  writeJSON(companies, "companies.json");

  res.status(201).send("company created!");
};

// createPayTransaction ==============================
exports.createPayTransaction = (req, res) => {
  let { car_num, putyovka_given, cash, card, company_id } = req.body;
  let { cars } = getData(["cars"]);
  if (!car_num || !cars[car_num.replaceAll(" ", "")]) {
    res.status(400).send(`car with this ${car_num} number not found!`);
    return;
  }

  let transaction = {
    payment_date: new Date().toLocaleString(),
    cash: cash || 0,
    card: card || 0,
  };
  let car_id = car_num.replaceAll(" ", "");
  addTransaction(car_id, putyovka_given, transaction);
  updatePaymentStatus(car_id, putyovka_given, transaction, company_id);

  res.status(201).send("Transaction added to: " + car_id);
};
