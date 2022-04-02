import "./styles/Body.css";
import Datacell from "./Datacell";
import React, { useState } from "react";
import History from "./History";

function Body({ person, data, fetchData }) {
  let carID = person.car_num.replaceAll(" ", "");
  let paymentHistory = data.payment_history[new Date().getFullYear()][carID];
  let company = data.companies[person.company_id].name;
  let thisPaymentStatus = data.payment_status[carID];

  let [paying, setPaying] = useState(false);
  let [payInput, setPayInput] = useState({
    car_num: person.car_num,
    company_id: person.company_id,
    putyovka_given: thisPaymentStatus.putyovka_given,
    cash: "",
    card: "",
  });

  function handleChange(e) {
    let { name, value } = e.target;
    if (name === "putyovka") {
      setPayInput((pv) => {
        return {
          ...pv,
          putyovka_given: !pv.putyovka_given,
        };
      });
    } else {
      setPayInput((pv) => {
        return {
          ...pv,
          [name]: value,
        };
      });
    }
  }

  let [seeHistory, setSeeHistory] = useState(false);

  function handleClick(e) {
    let { name } = e.target;
    if (name === "pay") {
      setPaying(true);
    } else if (name === "history") {
      setSeeHistory(true);
    } else if (name === "cancel") {
      setPaying(false);
    } else if (name === "save") {
      handleSubmit(payInput, fetchData);
      setPaying(false);
    } else if ("back") {
      setSeeHistory(false);
    }
  }

  return (
    <div className="body">
      <div className="body-left-div">
        <table>
          <tbody>
            <tr>
              <td>
                <Datacell
                  label="Permission number"
                  value={person.permission_num}
                />
              </td>
              <td>
                <Datacell
                  label="Permission expire date"
                  value={person.permission_expire_date}
                  progress={true}
                  startDate={person.permission_start_date}
                />
              </td>
              <td>
                <Datacell
                  label="Med. checkup expire date"
                  value={person.med_expire_date}
                  progress={true}
                  startDate={person.med_start_date}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Datacell label="Car brand" value={person.car_type} />
              </td>
              <td>
                <Datacell
                  label="Tech. checkup expire date"
                  value={person.checkup_expire_date}
                  progress={true}
                  startDate={person.checkup_start_date}
                />
              </td>
              <td>
                <Datacell
                  label="Work contract expire date"
                  value={person.work_contract_expire_date}
                  progress={true}
                  startDate={person.work_contract_start_date}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Datacell label="Route" value={person.route} />
              </td>
              <td>
                <Datacell
                  label="Rent contract expire date"
                  value={person.contract_expire_date}
                  progress={true}
                  startDate={person.contract_start_date}
                />
              </td>
              <td>
                <Datacell label="Address" value={person.address} />
              </td>
            </tr>
            <tr>
              <td>
                <Datacell label="Company name" value={company} />
              </td>
              <td>
                <Datacell
                  label="Polis expire date"
                  value={person.polis_expire_date}
                  progress={true}
                  startDate={person.polis_start_date}
                />
              </td>
              <td>
                <Datacell label="Phone number" value={person.phone} />
              </td>
            </tr>
            <tr>
              <td>
                <Datacell
                  classes="pass-data"
                  label="Passport information"
                  value={
                    <ul>
                      <li>{person.pass_num}</li>
                      <li>{person.pass_giving_auth}</li>
                      <li>
                        <b>Pass. given date </b>
                        <span>{person.pass_given_date}</span>
                      </li>
                    </ul>
                  }
                />
              </td>
              <td>
                <Datacell
                  label="Gas tank expire date"
                  value={person.gas_tank_expire_date}
                  progress={true}
                  startDate={person.gas_tank_start_date}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {eval(person.is_main_driver) && (
        <div className="payment-wrap-div">
          {seeHistory && (
            <History
              handleClick={handleClick}
              paymentHistory={paymentHistory}
            />
          )}
          {!seeHistory && (
            <div>
              <div className="payment-top-div"></div>
              <div className="payment-body-div">
                {!paying && (
                  <div className="balance-div">
                    <h5>
                      {parseInt(thisPaymentStatus.balance).toLocaleString()} сўм
                    </h5>
                    <hr />
                    <button
                      name="pay"
                      className="btn btn-sm btn-outline-success"
                      onClick={handleClick}
                    >
                      Pay
                    </button>
                    <button
                      name="history"
                      className="btn btn-sm btn-link"
                      onClick={handleClick}
                    >
                      Payment history
                    </button>
                  </div>
                )}
                {paying && (
                  <table>
                    <tbody>
                      <tr>
                        <td colSpan={2} className="pay-checkbox-td">
                          <label>Permission given </label>{" "}
                          <input
                            name="putyovka"
                            value={payInput.putyovka_given}
                            type="checkBox"
                            onChange={handleChange}
                            checked={payInput.putyovka_given}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <hr />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label name="cash">Cash: </label>
                        </td>
                        <td>
                          <input
                            name="cash"
                            type="number"
                            value={payInput.cash}
                            onChange={handleChange}
                            placeholder="0"
                            step="10"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label name="card">Card: </label>
                        </td>
                        <td>
                          <input
                            name="card"
                            type="number"
                            value={payInput.card}
                            onChange={handleChange}
                            placeholder="0"
                            step="10"
                          />
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={2} className="pay-btns-td">
                          <button
                            onClick={handleClick}
                            name="cancel"
                            className="btn btn-outline-danger btn-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleClick}
                            name="save"
                            className="btn btn-primary btn-sm"
                          >
                            Save
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Body;

function handleSubmit(payInput, fetchData) {
  let method = "POST";
  let URL = "http://localhost:9000/pay";

  fetch(URL, {
    method: method,
    body: JSON.stringify(payInput),
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
          setTimeout(() => {
            fetchData();
          }, 1000);
        }, 100);
      }
      // ====================
    })
    .catch((err) => console.log(err));
}
