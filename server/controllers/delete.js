const { deleteRecordInCSV, writeJSON } = require("../database/sjdb");
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

      res.status(200).send("record deleted!");

    }
  }
};
