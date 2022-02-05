import React from "react";
import "./styles/Navbar.css";
import Icon from "../Others/Icon";

function Navbar() {
  return (
    <div>
      <nav className="navigation-bar">
        <ul className="navigation-list">
          <li className="navigation-item">
            <h5>Маълумотлар</h5>
          </li>
          <li className="navigation-item">
            <Icon
              type="fas fa-user-plus"
              color="#06ab00"
              tooltiptext="Малумот Қўшиш"
            />
          </li>
          <li className="navigation-item">
            <Icon type="fas fa-print" color="#2499ff" tooltiptext="Печатлаш" />
          </li>
          <li className="navigation-item">
            <Icon
              type="fal fa-table"
              color="#ff9500"
              tooltiptext="'Excel'да олиш"
            />
          </li>

          <li className="navigation-item">
            <Icon type="fas fa-sort" color="#ff9500" tooltiptext="Филтерлаш" />
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
