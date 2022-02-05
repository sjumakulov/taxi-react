const { writeJSON, updateRecordInCSV } = require("../database/sjdb");
const { getData, addPayHistStatus } = require("./functions");

// update one person: // ! Add person info in the same order! //
exports.updatePerson = (req, res) => {
  let { person_id, company_id } = req.body,
    carIDNow = req.body.car_num.replaceAll(" ", "");

  if (!person_id || !carIDNow || !company_id) {
    res.status(400).send("IDs cannot be empty!");
    return;
  } else if (person_id && carIDNow && company_id) {
    let { persons, cars, companies } = getData([
      "persons",
      "cars",
      "companies",
    ]);
    let [thisPerson] = persons.filter((person) => {
      return person.person_id === person_id;
    });
    let thisCompany = companies[company_id];

    if (!thisPerson || !thisCompany) {
      res.status(400).send("record not found!");
      return;
    } else if (thisPerson && thisCompany) {
      // check if thisPerson was main_driver:
      let wasMainDriver = eval(thisPerson.is_main_driver),
        isMainDriver = eval(req.body.is_main_driver),
        carIDBefore = thisPerson.car_num.replaceAll(" ", ""),
        sameCar = carIDNow === carIDBefore;
      if (wasMainDriver) {
        if (isMainDriver) {
          if (sameCar) {
            // don't update cars.json
          } else if (!sameCar) {
            if (cars[carIDNow]) {
              let thisCarHasMainDriver = cars[carIDNow].main_driver;
              if (thisCarHasMainDriver) {
                res.status(400).send("This car already has main_driver!");
                return;
              } else if (!thisCarHasMainDriver) {
                // remove this person from old car's main_driver:
                if (cars[carIDBefore].other_drivers.length) {
                  cars[carIDBefore].main_driver = "";
                } else {
                  delete cars[carIDBefore];
                }
                // add this person this new car's main_driver:
                cars[carIDNow].main_driver = person_id;

                // write to cars.json
              }
            } else if (!cars[carIDNow]) {
              // remove this person from old car's main_driver:
              if (cars[carIDBefore].other_drivers.length) {
                cars[carIDBefore].main_driver = "";
              } else {
                delete cars[carIDBefore];
              }
              cars[carIDNow] = {
                main_driver: person_id,
                car_type: req.body.car_type,
                other_drivers: [],
              };
              // write to cars.json.

              // open payment status and history:
              addPayHistStatus(carIDNow);
            }
          }
        } else if (!isMainDriver) {
          if (sameCar) {
            cars[carIDNow].main_driver = "";
            cars[carIDNow].other_drivers.push(person_id);
          } else if (!sameCar) {
            // remove this person fro old car's main_driver:
            if (cars[carIDBefore].other_drivers.length) {
              cars[carIDBefore].main_driver = "";
            } else {
              delete cars[carIDBefore];
            }

            if (cars[carIDNow]) {
              // add this person this new car's other_drivers:
              cars[carIDNow].other_drivers.push(person_id);
              // write to cars.json
            } else if (!cars[carIDNow]) {
              cars[carIDNow] = {
                main_driver: "",
                car_type: req.body.car_type,
                other_drivers: [person_id],
              };
              // write to cars.json.

              // open payment status and history:
              addPayHistStatus(carIDNow);
            }
          }
        }
      } else if (!wasMainDriver) {
        if (isMainDriver) {
          if (sameCar) {
            if (cars[carIDNow].main_driver) {
              res
                .status(400)
                .send(`This ${carIDNow} car already has main_driver!`);
              return;
            } else {
              cars[carIDNow].main_driver = person_id;
              let other_drivers = cars[carIDNow].other_drivers.filter(
                (driver) => {
                  return driver !== person_id;
                }
              );
              cars[carIDNow].other_drivers = other_drivers;
              // write to cars.json.
            }
          } else if (!sameCar) {
            if (cars[carIDNow]) {
              if (cars[carIDNow].main_driver) {
                res
                  .status(400)
                  .send(`This ${carIDNow} already has main_driver!`);
                return;
              } else {
                // remove this person from old car's other_drivers:
                let other_drivers = cars[carIDBefore].other_drivers.filter(
                  (driver) => {
                    return driver !== person_id;
                  }
                );
                cars[carIDBefore].other_drivers = other_drivers;
                if (
                  !cars[carIDBefore].main_driver &&
                  cars[carIDBefore].other_drivers.length <= 1
                ) {
                  delete cars[carIDBefore];
                }

                // put this person in this car's main_driver:
                cars[carIDNow].main_driver = person_id;
                // write to cars.json.
              }
            } else if (!cars[carIDNow]) {
              // remove this person from old car's other_drivers:
              let other_drivers = cars[carIDBefore].other_drivers.filter(
                (driver) => {
                  return driver !== person_id;
                }
              );
              cars[carIDBefore].other_drivers = other_drivers;
              if (
                !cars[carIDBefore].main_driver &&
                cars[carIDBefore].other_drivers.length <= 1
              ) {
                delete cars[carIDBefore];
              }

              cars[carIDNow] = {
                main_driver: person_id,
                car_type: req.body.car_type,
                other_drivers: [],
              };
              // write to cars.json.

              // open payment status and history:
              addPayHistStatus(carIDNow);
            }
          }
        } else if (!isMainDriver) {
          if (sameCar) {
            // don't update cars.json.
          } else if (!sameCar) {
            // remove this person from old car's other_drivers:
            let other_drivers = cars[carIDBefore].other_drivers.filter(
              (driver) => {
                return driver !== person_id;
              }
            );
            cars[carIDBefore].other_drivers = other_drivers;
            if (
              !cars[carIDBefore].main_driver &&
              cars[carIDBefore].other_drivers.length <= 1
            ) {
              delete cars[carIDBefore];
            }

            cars[carIDBefore].other_drivers = other_drivers;
            if (cars[carIDNow]) {
              // put this person in this car's other_drivers:
              cars[carIDNow].other_drivers.push(person_id);
              // write to cars.json.
            } else {
              cars[carIDNow] = {
                main_driver: "",
                car_type: req.body.car_type,
                other_drivers: [person_id],
              };

              // open payment status and history:
              addPayHistStatus(carIDNow);
            }
          }
        }
      }

      // updating persons.csv:
      // updating start dates:
      let receivedKeys = Object.keys(req.body);
      let newStartDates = {};
      for (let i = 0; i < receivedKeys.length; i++) {
        if (i > 14) {
          let key = receivedKeys[i],
            startDateKey = key.replace("expire", "start");
          if (req.body[key] !== thisPerson[key]) {
            newStartDates[startDateKey] = new Date().toLocaleString();
          } else {
            newStartDates[startDateKey] = thisPerson[startDateKey];
          }
        }
      }

      // updating person:
      let updatedPerson = { ...req.body, ...newStartDates };

      console.log(updatedPerson);
      console.log(cars);

      updateRecordInCSV(thisPerson, updatedPerson);
      writeJSON(cars, "cars.json");

      console.log("thisPerson", thisPerson);
      console.log("req.body", req.body);
    }
    res.status(201).send("Record updated!");
  }

  // update person.csv:
  // update cars.json:
};

// update a company:
exports.updateCompany = (req, res) => {
  let { companies } = getData(["companies"]);
  let { company_id, name, color } = req.body;

  if (!company_id || !name || !color) {
    res.status(400).send("Empty content isn't allowed!");
    return;
  } else if (!companies[company_id]) {
    res.status(400).send(`Company with this ${company_id} ID not found!`);
    return;
  }

  companies[company_id] = { name: name, color: color };
  writeJSON(companies, "companies.json");

  res.status(201).send(`Company updated!`);
};

// update price:
exports.updatePrice = (req, res) => {
  let { other } = getData(["other"]),
    newPrice = parseInt(req.body.price);

  if (!newPrice || newPrice < 0) {
    res.status(400).send("Invalid price provided!");
    return;
  }

  other.price = newPrice;

  writeJSON(other, "other.json");

  res.status(201).send(`Price set to ${newPrice}`);
};
