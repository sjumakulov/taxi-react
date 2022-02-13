const { getData } = require("./functions");
const xlsx = require("xlsx");
const path = require("path");
const mime = require("mime");

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

exports.download = function (req, res) {
  let { persons, companies } = getData(["persons", "companies"]);

  let newPersons = persons.map((person) => {
    return {
      "Ф.И.О": person.name,
      "Ҳайдовчи гувоҳномаси": person.license_num,
      Тоифаси: person.license_category,
      "Автомобил рақами": person.car_num,
      "Асосий Шофер": eval(person.is_main_driver) ? "Ха" : "Ёъқ",
      "Лицензия АТ №": person.permission_num,
      "Лицензия муддати": person.permission_expire_date
        .split("-")
        .reverse()
        .join("-"),
      "Автомобил русуми": person.car_type,
      "Йўналиш номи": person.route,
      "Фирма номи": companies[person.company_id].name,
      "Паспорт сериаси & рақами": person.pass_num,
      "Паспорт берилган сана": person.pass_given_date
        .split("-")
        .reverse()
        .join("-"),
      "Паспорт берувчи маъмурият": person.pass_giving_auth,
      "Тех. курик муддат": person.checkup_expire_date
        .split("-")
        .reverse()
        .join("-"),
      "Ижара шартнома муддати": person.contract_expire_date
        .split("-")
        .reverse()
        .join("-"),
      "Полис муддати": person.polis_expire_date.split("-").reverse().join("-"),
      "Газ балон муддат": person.gas_tank_expire_date
        .split("-")
        .reverse()
        .join("-"),
      "Тиббий кўрик муддати": person.med_expire_date
        .split("-")
        .reverse()
        .join("-"),
      "Меҳнат шартнома муддати": person.work_contract_expire_date
        .split("-")
        .reverse()
        .join("-"),
      Манзил: person.address,
      Телефон: person.phone,
    };
  });

  createExcelFile(newPersons).then(() => {
    const file = __dirname + "/malumotlar.xlsx";
    const fileName = path.basename(file);
    const mimeType = mime.getType(file);
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    res.setHeader("Content-Type", mimeType);
    res.sendFile(path.resolve(file));
  });
};

async function createExcelFile(newPersons) {
  const ws = xlsx.utils.json_to_sheet(newPersons);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "sheet1");

  // generate buffer:
  xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

  // binary string:
  xlsx.write(wb, { bookType: "xlsx", type: "binary" });

  xlsx.writeFile(wb, __dirname + "/malumotlar.xlsx");
}
