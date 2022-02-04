const {
  appendToCSV,
  updateObjectInJSON,
  addObjectToJSONFile,
} = require("../database/sjdb");
const { getData, getIDs, makeid, addPayHistStatus } = require("./functions");

// ! Add person info in the same order! //
// create one record in data files:==========================
exports.createPerson = (req, res) => {
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
      res.status(201).send("Record created!");
      let data = getData(["cars"]);
      // getting IDs:
      let { IDs, car_IDs } = getIDs();

      // generating unique IDs:
      let person_id = makeid(20, IDs);

      // time now:
      let now = new Date().toLocaleString();

      // checking if main_driver exists or not:
      let currentCarID = req.body.car_num.replaceAll(" ", "");
      let carExists = car_IDs.includes(currentCarID);
      let carHasMainDriver = carExists
        ? data.cars[currentCarID].main_driver
        : false;

      // adding data to temporary object:
      let recordObject = {
        person_id: person_id,
        ...req.body,
        is_main_driver: req.body.is_main_driver ? !carHasMainDriver : false,
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
        if (eval(recordObject.is_main_driver)) {
          let oldObject_car = data.cars[currentCarID];
          let updatedObject_car = { ...oldObject_car, main_driver: person_id };
          updateObjectInJSON(oldObject_car, updatedObject_car, "cars.json");

          // opening payment history and status for main driver:
          addPayHistStatus(person_id);
        } else {
          let oldObject_car = data.cars[currentCarID];
          let updatedObject_car = {
            ...oldObject_car,
            other_drivers: [...oldObject_car.other_drivers, person_id],
          };
          updateObjectInJSON(oldObject_car, updatedObject_car, "cars.json");
        }
      } else {
        if (eval(recordObject.is_main_driver)) {
          let object_car = {
            [currentCarID]: {
              main_driver: person_id,
              car_type: recordObject.car_type,
              other_drivers: [],
            },
          };
          addObjectToJSONFile(object_car, "cars.json");

          // opening payment history and status for main driver:
          addPayHistStatus(person_id);
        } else {
          let object_car = {
            [currentCarID]: {
              main_driver: "",
              car_type: recordObject.car_type,
              other_drivers: [person_id],
            },
          };
          addObjectToJSONFile(object_car, "cars.json");
        }
      }
    }
  }
  // res.redirect("/");
};

//createCompany==========================================
exports.createCompany = (req, res) => {
  // getting IDs:
  let { IDs } = getIDs();

  // generating unique IDs:
  let company_id = makeid(20, IDs);

  let obj_company = {
    [company_id]: {
      ...req.body,
    },
  };
  addObjectToJSONFile(obj_company, "companies.json");
};

// createPayTransaction ==============================
exports.createPayTransaction = (req, res) => {
  let { person_id, putyovka_given, cash, card, debt_deadline } = req.body;
  let transaction = {
    payment_date: new Date().toLocaleString(),
    cash: cash,
    card: card,
  };

  addTransaction(person_id, putyovka_given, transaction);
  updatePaymentStatus(person_id, putyovka_given, transaction, debt_deadline);
};

function addTransaction(person_id, putyovka_given, transaction) {
  let { payment_history } = getData(["payment_history"]);
  let date = new Date(),
    thisYear = date.getFullYear(),
    thisMonth = date.getMonth();

  let thisYears_obj = payment_history[thisYear],
    thisPerson_obj = thisYears_obj[person_id],
    thisMonth_obj = thisPerson_obj[thisMonth];

  if (thisMonth_obj) {
    let old_obj = {
      [person_id]: JSON.parse(JSON.stringify(thisPerson_obj)),
    };
    let updated_obj = {
      [person_id]: JSON.parse(JSON.stringify(thisPerson_obj)),
    };
    updated_obj[person_id][thisMonth].putyovka_given = putyovka_given;
    updated_obj[person_id][thisMonth].history.push(transaction);

    // updating "payment_history.json":
    updateObjectInJSON(old_obj, updated_obj, "payment_history.json");
  } else {
    let old_obj = {
      [person_id]: JSON.parse(JSON.stringify(thisPerson_obj)),
    };
    let updated_obj = {
      [person_id]: JSON.parse(JSON.stringify(thisPerson_obj)),
    };
    let thisMonth_obj = {
      putyovka_given: putyovka_given,
      history: [transaction],
    };
    updated_obj[person_id][thisMonth] = thisMonth_obj;

    // updating "payment_history.json":
    updateObjectInJSON(old_obj, updated_obj, "payment_history.json");
  }
}

// update payment status for this person:
function updatePaymentStatus(
  person_id,
  putyovka_given,
  transaction,
  debt_deadline
) {
  let { payment_status } = getData(["payment_status"]);

  let pay_status_old_obj = { [person_id]: { ...payment_status[person_id] } };

  let paymentAmount =
      (parseInt(transaction.cash) || 0) + (parseInt(transaction.card) || 0),
    currentBalance = parseInt(payment_status[person_id].balance) || 0,
    newBalance = currentBalance + paymentAmount,
    debt_start_date = debt_deadline ? new Date().toLocaleString() : "";

  console.log(
    "paymentAmount: ",
    paymentAmount,
    "currentBalance: ",
    currentBalance,
    "newBalance: ",
    newBalance
  );
  let pay_status_updated_obj = {
    [person_id]: {
      ...payment_status[person_id],
      putyovka_given: putyovka_given,
      balance: newBalance,
      debt_start_date: debt_start_date,
      debt_deadline: debt_deadline,
    },
  };

  // update payment status for this person:
  updateObjectInJSON(
    pay_status_old_obj,
    pay_status_updated_obj,
    "payment_status.json"
  );
}
//===========================================================
