import React, { useState } from "react";
import Icon from "../Others/Icon";
import Datacell from "./Datacell";
import "./styles/Head.css";
import Warning from "../Navbar/Warning";

function Head({ data, person, showBody, clickIcon, bodyvisible, fetchData }) {
  let putyovkaGiven =
    data.payment_status[person.car_num.replaceAll(" ", "")].putyovka_given;

  let color = data.companies[person.company_id].color;
  let [deleting, setDeleting] = useState(false);

  function showWarning() {
    setDeleting(true);
  }

  return (
    <div className={bodyvisible ? "active head" : "head"} onClick={showBody}>
      {deleting && (
        <Warning
          setDeleting={setDeleting}
          person_id={person.person_id}
          fetchData={fetchData}
        />
      )}
      <div className="head-color-div" style={{ backgroundColor: color }}></div>
      <div className="head-data-div">
        <Datacell classes="name-div" label="Name" value={person.name} />
        <Datacell
          classes="column-div"
          label="Driver's lisence"
          value={person.license_num}
        />
        <Datacell
          classes="column-div"
          label="Driver's lisence category"
          value={person.license_category}
        />
        <Datacell
          classes="column-div"
          label="Car number"
          value={person.car_num}
        />
        <Datacell
          classes="column-div"
          label="Main driver"
          value={
            person.is_main_driver === "true" && (
              <i className="fas fa-check-circle"></i>
            )
          }
        />
        <div className="tool-div">
          {putyovkaGiven && (
            <Icon
              type="fas fa-print dont-show"
              color="#2499ff"
              tooltiptext="Print"
              handleClick={clickIcon}
              id="printFront"
              person={person}
            />
          )}

          <Icon
            type="fas fa-pencil dont-show"
            color="#ff9500"
            tooltiptext="Edit"
            handleClick={clickIcon}
            person={person}
            id="editPerson"
          />

          <Icon
            type="fas fa-user-minus dont-show"
            color="#e30505"
            tooltiptext="Delete"
            handleClick={showWarning}
            id="deletePerson"
          />
        </div>
      </div>
    </div>
  );
}

export default Head;
