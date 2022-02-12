const { readCSV, readJSON, writeJSON } = require("../database/sjdb");

// Function that gets all data from data files:============
function getData(types) {
  let data = {};
  for (let i = 0; i < types.length; i++) {
    let thisType = types[i];

    if (thisType === "persons") {
      data[thisType] = readCSV();
    } else {
      data[thisType] = readJSON(thisType + ".json");
    }
  }
  return data;
}
exports.getData = getData;

// Function that gets all ids:====================================
exports.getIDs = () => {
  let DATA = getData(["persons", "companies", "cars"]);
  let persons_IDs = DATA.persons.map((obj) => {
      return obj.person_id;
    }),
    companies_IDs = Object.keys(DATA.companies);
  let IDs = [...persons_IDs, ...companies_IDs];
  let car_IDs = Object.keys(DATA.cars);
  return { IDs: IDs, car_IDs: car_IDs };
};

// opening pay_status and pay_history if a person is main_driver:
exports.addPayHistStatus = (car_id) => {
  let thisYear = new Date().getFullYear();
  let { payment_history, payment_status } = getData([
    "payment_history",
    "payment_status",
  ]);

  if (payment_history[thisYear]) {
    payment_history[thisYear][car_id] = {};

    // updating "payment_history.json":
    writeJSON(payment_history, "payment_history.json");
  } else {
    payment_history[thisYear] = { [car_id]: {} };
    // adding new year to "payment_history.json":
    writeJSON(payment_history, "payment_history.json");
  }

  // writing to payment_status.json:
  payment_status[car_id] = {
    balance: 0,
    putyovka_given: false,
  };

  writeJSON(payment_status, "payment_status.json");
};

// Defining id generator:=====================================
exports.makeid = (length, IDs) => {
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  if (IDs.length) {
    do {
      var result = "";
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
    } while (IDs.includes(result));
  } else {
    var result = "";
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }
  return result;
};
//=============================================================

exports.addTransaction = (car_id, putyovka_given, transaction) => {
  let { payment_history } = getData(["payment_history"]);
  let date = new Date(),
    thisYear = date.getFullYear(),
    thisMonth = date.getMonth();

  if (payment_history[thisYear][car_id][thisMonth]) {
    payment_history[thisYear][car_id][thisMonth].putyovka_given =
      putyovka_given;
    payment_history[thisYear][car_id][thisMonth].history.push(transaction);
    writeJSON(payment_history, "payment_history.json");
  } else {
    let thisMonth_obj = {
      putyovka_given: putyovka_given,
      history: [transaction],
    };
    payment_history[thisYear][car_id][thisMonth] = thisMonth_obj;

    // updating "payment_history.json":
    writeJSON(payment_history, "payment_history.json");
  }
};

// update payment status for this person:
exports.updatePaymentStatus = (
  car_id,
  putyovka_given,
  transaction,
  companyID
) => {
  let { payment_status } = getData(["payment_status"]);

  let paymentAmount =
      (parseInt(transaction.cash) || 0) + (parseInt(transaction.card) || 0),
    currentBalance = parseInt(payment_status[car_id].balance) || 0,
    newBalance = currentBalance + paymentAmount;

  if (eval(putyovka_given)) {
    payment_status[car_id] = {
      putyovka_given: putyovka_given,
      balance: newBalance,
      putyovka_num: putyovkaNumber(companyID),
    };
  } else {
    payment_status[car_id] = {
      putyovka_given: putyovka_given,
      balance: newBalance,
    };
  }
  // update payment status for this car:
  writeJSON(payment_status, "payment_status.json");
};
//===========================================================

// Function that numbers putyovkas in one company:
function putyovkaNumber(companyID) {
  let { persons, payment_status } = getData(["persons", "payment_status"]);
  let carIDs = [],
    count = 1,
    putyovkaNums = [];

  persons.map((person) => {
    if (person.company_id === companyID) {
      let carID = person.car_num.replaceAll(" ", "");
      if (!carIDs.includes(carID)) {
        if (eval(payment_status[carID].putyovka_given)) {
          putyovkaNums.push(parseInt(payment_status[carID].putyovka_num));
          count++;
        }
        carIDs.push(carID);
      }
    }
  });
  let maxPutyovkaNum = Math.max(...putyovkaNums);
  if (maxPutyovkaNum !== putyovkaNums.length) {
    for (let i = 1; i <= maxPutyovkaNum; i++) {
      if (!putyovkaNums.includes(i)) {
        count = i;
        break;
      }
    }
  }

  return count;
}

// function that that gets called every month and updates payment_status.json:
function setPaymentStatus() {
  let { other } = getData(["other"]),
    lastDayOfMonth = new Date(other.last_day_month).getTime(),
    now = new Date().getTime(),
    timeLeft = lastDayOfMonth - now;
  if (timeLeft < 0) {
    let { payment_status } = getData(["payment_status"]),
      IDs = Object.keys(payment_status);

    for (let i = 0; i < IDs.length - 1; i++) {
      let currentStatus = payment_status[IDs[i]];
      if (eval(currentStatus.putyovka_given)) {
        let newBalance =
          parseInt(currentStatus.balance) - (parseInt(other.price) || 0);
        currentStatus.balance = newBalance;
        currentStatus.putyovka_given = false;
      }
    }

    let date = new Date();
    let last_day = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0);
    other.last_day_month = last_day.toLocaleString();

    writeJSON(payment_status, "payment_status.json");
    writeJSON(other, "other.json");
  }
}
setPaymentStatus();
//===================================================


// function that that gets called every two years and deletes old history in payment_history.json:
function cleanUpHistory(){
  let { other } = getData(["other"]);

  let timeLeft = new Date(other.last_day_year).getTime() - new Date().getTime();

  if(timeLeft<0){
    let {payment_history} = getData(["payment_history"]);
    let yearToDelete = new Date(other.last_day_year).getFullYear()-1;

    delete payment_history[yearToDelete];
  
    other.last_day_year = new Date(new Date().getFullYear()+1, 11, 0);
    
    writeJSON(other, "other.json");
    writeJSON(payment_history, "payment_history.json");
  }
}

cleanUpHistory();
//===================================================
