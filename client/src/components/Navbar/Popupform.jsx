import React, { useState } from "react";
import "./styles/Popupform.css";

function Popupform({ companies, person, cars, type, setStates, fetchData }) {
  let default_person = {};

  if (type === "edit") {
    default_person = { ...person };
    default_person.is_main_driver = eval(default_person.is_main_driver);
  } else {
    default_person = {
      company_id: Object.keys(companies)[0],
      name: "",
      license_num: "",
      license_category: "",
      car_num: "",
      permission_num: "",
      is_main_driver: false,
      route: "",
      car_type: "",
      address: "",
      pass_num: "",
      pass_giving_auth: "",
      pass_given_date: "",
      phone: "",
      med_expire_date: "",
      polis_expire_date: "",
      contract_expire_date: "",
      permission_expire_date: "",
      gas_tank_expire_date: "",
      checkup_expire_date: "",
      work_contract_expire_date: "",
    };
  }

  let [inputData, setInputData] = useState(default_person);

  let [checkBoxDisabled, setCheckBoxDisabled] = useState(
    initVal(inputData, cars, type)
  );

  function handleChange(e) {
    let { name, value } = e.target;

    if (name === "is_main_driver") {
      setInputData((pv) => {
        return {
          ...pv,
          is_main_driver: !pv.is_main_driver,
        };
      });
    } else {
      if (name === "car_num" || name === "license_category") {
        value = value.toUpperCase();
      }
      setInputData((pv) => {
        return {
          ...pv,
          [name]: value,
        };
      });
    }
    if (name === "car_num") {
      if (type === "edit") {
        let carID = value.replaceAll(" ", "").toUpperCase();
        let thisCar = cars[carID];
        if (thisCar) {
          if (thisCar.main_driver) {
            if (thisCar.main_driver === person.person_id) {
              setCheckBoxDisabled(false);
            } else {
              setCheckBoxDisabled(true);
              setInputData((pv) => {
                return {
                  ...pv,
                  is_main_driver: false,
                };
              });
            }
          } else {
            setCheckBoxDisabled(false);
          }
        } else {
          setCheckBoxDisabled(false);
        }
      } else if (type === "add") {
        let carID = value.replaceAll(" ", "");
        let thisCar = cars[carID];

        if (thisCar) {
          if (thisCar.main_driver) {
            setCheckBoxDisabled(true);
            setInputData((pv) => {
              return {
                ...pv,
                is_main_driver: false,
              };
            });
          } else {
            setCheckBoxDisabled(false);
          }
        } else {
          setCheckBoxDisabled(false);
        }
      }
    }
  }

  const handleClick = (e) => {
    if (e.target.type === "button") {
      if (type === "edit") {
        setStates((pv) => {
          return { ...pv, editPerson: false };
        });
      } else {
        setStates((pv) => {
          return { ...pv, addPerson: false };
        });
      }
    } else {
      e.preventDefault();
      handleSubmit(inputData, type, fetchData);

      if (type === "edit") {
        setStates((pv) => {
          return { ...pv, editPerson: false };
        });
      } else {
        setStates((pv) => {
          return { ...pv, addPerson: false };
        });
      }
    }
  };

  return (
    <div className="popupform-background">
      <form onSubmit={handleClick}>
        <h2 className="person-form-title">
          {type === "add" ? "Малумот қўшиш" : "Маълумотларни Ўзгартириш"}
        </h2>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Хайдовчи ФИО</label> <br />
                <input
                  type="text"
                  name="name"
                  value={inputData.name ? inputData.name : ""}
                  onChange={handleChange}
                />
              </td>
              <td>
                <label>АЛицензия Т №</label> <br />
                <input
                  type="text"
                  name="permission_num"
                  value={
                    inputData.permission_num ? inputData.permission_num : ""
                  }
                  onChange={handleChange}
                />
              </td>
            </tr>

            <tr>
              <td>
                <label>Фирма номи</label> <br />
                <select name="company_id" onChange={handleChange}>
                  {options(companies, person.company_id, type)}
                </select>
              </td>
              <td>
                <label>Лицензия муддати</label> <br />
                <input
                  type="date"
                  name="permission_expire_date"
                  value={
                    inputData.permission_expire_date
                      ? inputData.permission_expire_date
                      : ""
                  }
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Йўналиш номи</label> <br />
                <input
                  type="text"
                  name="route"
                  value={inputData.route ? inputData.route : ""}
                  onChange={handleChange}
                />
              </td>
              <td>
                <label>Ижара шартнома муддати</label> <br />
                <input
                  type="date"
                  name="contract_expire_date"
                  value={
                    inputData.contract_expire_date
                      ? inputData.contract_expire_date
                      : ""
                  }
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Автомобил русуми</label> <br />
                <input
                  type="text"
                  name="car_type"
                  value={inputData.car_type ? inputData.car_type : ""}
                  onChange={handleChange}
                />
              </td>
              <td>
                <label>Полис муддати</label> <br />
                <input
                  type="date"
                  name="polis_expire_date"
                  value={
                    inputData.polis_expire_date
                      ? inputData.polis_expire_date
                      : ""
                  }
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Давлат рақами</label> <br />
                <input
                  type="text"
                  name="car_num"
                  value={inputData.car_num ? inputData.car_num : ""}
                  onChange={handleChange}
                  required
                />
              </td>
              <td>
                <label>Газ балон муддат</label> <br />
                <input
                  type="date"
                  name="gas_tank_expire_date"
                  value={
                    inputData.gas_tank_expire_date
                      ? inputData.gas_tank_expire_date
                      : ""
                  }
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Ҳайдовчилик гувоҳномаси</label> <br />
                <input
                  type="text"
                  name="license_num"
                  value={inputData.license_num ? inputData.license_num : ""}
                  onChange={handleChange}
                />
              </td>
              <td>
                <label>Тех. Курик муддат</label> <br />
                <input
                  type="date"
                  name="checkup_expire_date"
                  value={
                    inputData.checkup_expire_date
                      ? inputData.checkup_expire_date
                      : ""
                  }
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Тоифаси</label> <br />
                <input
                  type="text"
                  name="license_category"
                  value={
                    inputData.license_category ? inputData.license_category : ""
                  }
                  onChange={handleChange}
                />
              </td>
              <td>
                <label>Асосий Шофер?</label> <br />
                <input
                  type="checkBox"
                  name="is_main_driver"
                  onChange={handleChange}
                  checked={inputData.is_main_driver}
                  disabled={checkBoxDisabled}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <h3 className="person-form-title">Қўшимча Маълумотлар</h3>
              </td>
            </tr>
            <tr>
              <td>
                <label>Паспорт сериаси & рақами</label> <br />
                <input
                  type="text"
                  name="pass_num"
                  value={inputData.pass_num ? inputData.pass_num : ""}
                  onChange={handleChange}
                />
              </td>
              <td>
                <label>Тиббий кўрик муддати:</label> <br />
                <input
                  type="date"
                  name="med_expire_date"
                  value={
                    inputData.med_expire_date ? inputData.med_expire_date : ""
                  }
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Паспорт берилган сана</label> <br />
                <input
                  type="date"
                  name="pass_given_date"
                  value={
                    inputData.pass_given_date ? inputData.pass_given_date : ""
                  }
                  onChange={handleChange}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </td>
              <td>
                <label>Меҳнат шартнома муддати:</label> <br />
                <input
                  type="date"
                  name="work_contract_expire_date"
                  value={
                    inputData.work_contract_expire_date
                      ? inputData.work_contract_expire_date
                      : ""
                  }
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Паспорт берувчи маъмурият</label> <br />
                <input
                  type="text"
                  name="pass_giving_auth"
                  value={
                    inputData.pass_giving_auth ? inputData.pass_giving_auth : ""
                  }
                  onChange={handleChange}
                />
              </td>
              <td>
                <label>Манзил</label> <br />
                <input
                  type="text"
                  name="address"
                  value={inputData.address ? inputData.address : ""}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Тел рақам</label> <br />
                <input
                  type="text"
                  name="phone"
                  value={inputData.phone ? inputData.phone : ""}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <button
                  type="button"
                  onClick={handleClick}
                  className="btn btn-danger "
                >
                  Бекор Қилиш
                </button>
              </td>
              <td>
                <button type="submit" className="btn btn-primary">
                  Сақлаш
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default Popupform;

function options(companies, company_id, type) {
  let companiesKeys = Object.keys(companies);
  let defaultCompany =
    type === "edit"
      ? companies[company_id].name
      : companies[companiesKeys[0]].name;

  return companiesKeys.map((key) => {
    return (
      <option value={key} key={key} defaultValue={defaultCompany}>
        {companies[key].name}
      </option>
    );
  });
}

function initVal(inputData, cars, type) {
  let car = cars[inputData.car_num.replaceAll(" ", "")];
  let main_driver = car ? car.main_driver : false;

  let initVal = false;
  if (inputData.is_main_driver && type === "edit") {
    initVal = false;
  } else if (!inputData.is_main_driver && type === "edit" && main_driver) {
    initVal = true;
  } else {
    initVal = false;
  }

  return initVal;
}

function handleSubmit(inputData, type, fetchData) {
  let method = type === "edit" ? "PUT" : "POST";
  let URL =
    type === "edit"
      ? "http://localhost:9000/person"
      : "http://localhost:9000/persons";

  fetch(URL, {
    method: method,
    body: JSON.stringify(inputData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Accept: "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      // this is not a solution:
      if (response.status === 201) {
        setTimeout(() => {
        fetchData();
        }, 100);
      }
      // ====================
    })
    .catch((err) => console.log(err));
}
