import React from "react";
import "./styles/Navbar.css";
import Icon from "../Others/Icon";

function Navbar({ clickIcon }) {

  return (
    <div>
      <nav className="navigation-bar">
        <ul className="navigation-list">
          <li className="navigation-item">
            <h5 onClick={clickIcon} id="info">Маълумотлар</h5>
          </li>
          <li className="navigation-item">
            <Icon
              type="fas fa-user-plus"
              color="#06ab00"
              tooltiptext="Малумот Қўшиш"
              handleClick={clickIcon}
              id="addPerson"
            />
          </li>
          <li className="navigation-item">
            <Icon
              type="fas fa-print"
              color="#2499ff"
              tooltiptext="Печатлаш"
              id="printBack"
              handleClick={clickIcon}
            />
          </li>
          <li className="navigation-item">
            <Icon
              type="fal fa-table"
              color="#ff9500"
              tooltiptext="'Excel'да олиш"
              id="excel"
              handleClick={clickIcon}
            />
          </li>

          <li className="navigation-item">
            <Icon
              type="fas fa-sort"
              color="#ff9500"
              tooltiptext="Филтерлаш"
              id="filter"
              handleClick={clickIcon}
            />
          </li>

          <li className="navigation-item">
            <input
              type="text"
              placeholder="Излаш..."
              name="search"
              id="searchInput"
            />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
