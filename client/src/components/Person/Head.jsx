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
        <Datacell classes="name-div" label="Ф.И.О:" value={person.name} />
        <Datacell
          classes="column-div"
          label="Ҳайдовчи гувоҳномаси:"
          value={person.license_num}
        />
        <Datacell
          classes="column-div"
          label="Тоифаси:"
          value={person.license_category}
        />
        <Datacell
          classes="column-div"
          label="Автомобил рақами:"
          value={person.car_num}
        />
        <Datacell
          classes="column-div"
          label="Асосий Шофер:"
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
              tooltiptext="Печатлаш"
              handleClick={clickIcon}
              id="printFront"
              person={person}
            />
          )}

          <Icon
            type="fas fa-pencil dont-show"
            color="#ff9500"
            tooltiptext="Ўзгартириш"
            handleClick={clickIcon}
            person={person}
            id="editPerson"
          />

          <Icon
            type="fas fa-user-minus dont-show"
            color="#e30505"
            tooltiptext="Ўчириш"
            handleClick={showWarning}
            id="deletePerson"
          />
        </div>
      </div>
    </div>
  );
}

export default Head;
