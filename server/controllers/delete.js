const {
  deleteRecordInCSV,
  updateObjectInJSON,
  deleteObjectInJSON,
  writeJSON,
} = require("../database/sjdb");
const { getData } = require("./functions");

exports.deletePerson = (req, res) => {
  const ID = req.body.id;
  const { persons, payment_status, payment_history, cars } = getData([
    "persons",
    "payment_status",
    "payment_history",
    "cars",
  ]);

  // delete from persons.csv:
  let [thisPerson] = persons.filter((person) => {
    return person.person_id === ID;
  });

  if (thisPerson) {
    deleteRecordInCSV(thisPerson);
    // delete person_id from cars:
    // delete car if THIS Person is the only driver:
    let car_id = thisPerson.car_num.replaceAll(" ", ""),
      isMainDriver = eval(thisPerson.is_main_driver),
      numOfOtherDrivers = cars[car_id].other_drivers.length;
    if (isMainDriver) {
      if (numOfOtherDrivers === 0) {
        delete cars[car_id];
      } else {
        cars[car_id].main_driver = "";
      }
    } else {
      if (cars[car_id].main_driver === "") {
        if (numOfOtherDrivers <= 1) {
          delete cars[car_id];
        } else {
          let otherDrivers = cars[car_id].other_drivers.filter((driver) => {
            return driver !== ID;
          });
          cars[car_id].other_drivers = otherDrivers;
        }
      }else{
        let otherDrivers = cars[car_id].other_drivers.filter((driver) => {
          return driver !== ID;
        });
        cars[car_id].other_drivers = otherDrivers;
      }
    }
    writeJSON(cars, "cars.json");

    // identify if is_main_driver === true:
    if (isMainDriver) {
      // delete from payment_status if THIS Person is MAIN_DRIVER:
      deleteObjectInJSON(payment_status, ID, "payment_status.json");

      // delete from payment_history if THIS Person is MAIN_DRIVER:
      Object.keys(payment_history).forEach((year) => {
        if (payment_history[year][ID]) {
          let old_obj = { [year]: { ...payment_history[year] } };
          let new_obj = JSON.parse(JSON.stringify(old_obj));
          delete new_obj[year][ID];
          updateObjectInJSON(old_obj, new_obj, "payment_history.json");
        }
      });
    }
  }
};
