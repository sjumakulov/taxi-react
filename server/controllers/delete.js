const {
  deleteRecordInCSV,
  updateObjectInJSON,
  deleteObjectInJSON,
  writeJSON,
} = require("../database/sjdb");
const { getData } = require("./functions");

exports.deletePerson = (req, res) => {
  let { person_id } = req.body;

  if (!person_id) {
    res.status(400).send("record not found 1");
    return;

  } else if (person_id) {
    let { persons, cars } = getData(["persons", "cars"]);
    let [thisPerson] = persons.filter((person) => {
      return person.person_id === person_id;
    });

    let thisCar = thisPerson
      ? cars[thisPerson.car_num.replaceAll(" ", "")]
      : false;

    if (!thisPerson || !thisCar) {
      res.status(400).send("record not found 2");

      return;
    } else if (thisPerson && thisCar) {
      res.status(200).send("record deleted!");

      const { payment_status, payment_history } = getData([
        "payment_status",
        "payment_history",
      ]);

      // delete from persons.csv:
      let [thisPerson] = persons.filter((person) => {
        return person.person_id === person_id;
      });

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
              return driver !== person_id;
            });
            cars[car_id].other_drivers = otherDrivers;
          }
        } else {
          let otherDrivers = cars[car_id].other_drivers.filter((driver) => {
            return driver !== person_id;
          });
          cars[car_id].other_drivers = otherDrivers;
        }
      }
      writeJSON(cars, "cars.json");

      // identify if is_main_driver === true:
      if (isMainDriver) {
        // delete from payment_status if THIS Person is MAIN_DRIVER:
        deleteObjectInJSON(payment_status, person_id, "payment_status.json");

        // delete from payment_history if THIS Person is MAIN_DRIVER:
        Object.keys(payment_history).forEach((year) => {
          if (payment_history[year][person_id]) {
            let old_obj = { [year]: { ...payment_history[year] } };
            let new_obj = JSON.parse(JSON.stringify(old_obj));
            delete new_obj[year][person_id];
            updateObjectInJSON(old_obj, new_obj, "payment_history.json");
          }
        });
      }
    }
  }
};
