import React from "react";
import Icon from "../Others/Icon";
import Datacell from "./Datacell";
import "./styles/Head.css";

function Head({ data, person }) {
  let color = data.companies[person.company_id].color;

  return (
    <div className="head">
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
          <Icon type="fas fa-print" color="#2499ff" tooltiptext="Печатлаш" />
          <Icon type="fas fa-pencil" color="#ff9500" tooltiptext="Ўзгартириш" />
          <Icon type="fas fa-user-minus" color="#e30505" tooltiptext="Ўчириш" />
        </div>
      </div>
    </div>
  );
}

export default Head;
