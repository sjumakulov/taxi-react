const {
  readCSV,
  readJSON,
  addObjectToJSONFile,
  updateObjectInJSON,
  writeJSON,
} = require("../database/sjdb");

// Function that gets all data from data files:============
function getData(types) {
  let data = {};
  for(let i=0; i<types.length; i++){
    let thisType = types[i];

    if(thisType === "persons"){
      data[thisType] = readCSV();
    }else{
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
exports.addPayHistStatus = (person_id) => {
  let thisYear = new Date().getFullYear();
  let { payment_history } = getData(["payment_history"]),
    thisYears_obj = payment_history[thisYear];

  if (thisYears_obj) {
    let old_obj = { [thisYear]: JSON.parse(JSON.stringify(thisYears_obj)) };
    let updated_obj = { [thisYear]: JSON.parse(JSON.stringify(thisYears_obj)) };
    updated_obj[thisYear][person_id] = {};
    // updating "payment_history.json":
    updateObjectInJSON(old_obj, updated_obj, "payment_history.json");
  } else {
    let object_pay_history = {
      [thisYear]: {
        [person_id]: {},
      },
    };
    // adding new year to "payment_history.json":
    addObjectToJSONFile(object_pay_history, "payment_history.json");
  }

  // writing to payment_status.json:
  let object_paymentStatus = {
    [person_id]: {
      balance: 0,
      debt_start_date: "",
      debt_deadline: "",
      putyovka_given: false,
    },
  };
  addObjectToJSONFile(object_paymentStatus, "payment_status.json");
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
    let last_day = new Date(date.getFullYear(), date.getMonth()+1, 0, 0);
    other.last_day_month = last_day.toLocaleString();

    writeJSON(payment_status, "payment_status.json");
    writeJSON(other, "other.json");
  }


} 
setPaymentStatus();
 //===================================================