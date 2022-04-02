import React, { useEffect } from "react";
import "./Frontpage.css";

function Frontpage({ person, company, setStates, putyovkaNum }) {
  let m = new Date().toLocaleString("En", { month: "long" });
  let month = m.replace(m[0], m[0].toUpperCase());
  let year = new Date().getFullYear();
  let image = require("./car.PNG");

  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 500);
    window.onafterprint = () => {
      setStates((pv) => {
        return {
          ...pv,
          printFront: false,
        };
      });
    };
  }, [setStates, image]);

  return (
    <div className="frontpage-background">
      <div className="frontpage-wrap">
        <div className="front-left">
          <table>
            <tbody>
              <tr>
              <th>Date</th>
                <th>Driver's health state</th>
                <th>Vehicle's state</th>
                <th>Daily payment</th>
                <th>Leaving time</th>
                <th>Time arrived</th>
              </tr>
              {rows()}
            </tbody>
          </table>
          <div className="front-left-bottom">
            <h5>Warnings given:</h5>
            <hr />
            <hr />
            <hr />
            <hr />
            <hr />
            <hr />
          </div>
        </div>

        <div className="front-right">
          <div className="front-right-top">
            <div className="">
              <h5>
                «{month}» {year}
              </h5>
              <h5>Permission number: {putyovkaNum}</h5>
            </div>
            <h4>{company}</h4>
            <img src={image} alt="car-img" />
          </div>
          <div className="front-right-bottom">
            <table>
              <tbody>
                <tr>
                  <td colSpan="2">
                    Route: <b>{person.route}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Driver's name: <b>{person.name}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Car brand: <b>{person.car_type}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Car number: <b>{person.car_num}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Driver's lisence number: <b>{person.license_num}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Driver's lisence category: <b>{person.license_category}</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    Permission number: <b>№ {person.permission_num}</b>
                  </td>
                  <td>
                  Permission expire date: <b>{person.permission_expire_date}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Rent expire date: <b>{person.contract_expire_date}</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    Polis expire date: <b>{person.polis_expire_date}</b>
                  </td>
                  <td>
                    Gas tank expire date: <b>{person.gas_tank_expire_date}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Tech. checkup expire date: <b>{person.checkup_expire_date}</b>
                  </td>
                </tr>
              </tbody>
            </table>
            <h5 className="dispecher-text">
              Dispacher: _____________________
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Frontpage;

function rows() {
  let now = new Date(),
    year = now.getFullYear(),
    month = now.getMonth(),
    numOfdays = new Date(year, month + 1, 0).getDate();

  let rows = [];
  for (let i = 24; i <= numOfdays; i++) {
    let date = new Date(year, month, i)
      .toLocaleString("En", { dat: "2-digit" })
      .slice(0, 10);

    rows.push(
      <tr key={i + "row"}>
        <td className="td-date">{date}</td>
        <td className="td-stamp"></td>
        <td className="td-stamp"></td>
        <td className="td-stamp"></td>
        <td className="td-leaving-time"></td>
        <td className="td-leaving-time"></td>
      </tr>
    );
  }

  return rows;
}
