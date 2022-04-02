import React from "react";
import "./styles/Navbar.css";
import Icon from "../Others/Icon";

function Navbar({ clickIcon, setSeeStat, setSearchInput }) {
  function handleChange(e) {
    setSearchInput(e.target.value);
  }

  return (
    <div>
      <nav className="navigation-bar">
        <ul className="navigation-list">
          <li className="navigation-item">
            <h5
              onClick={() => {
                setSeeStat(true);
              }}
              id="info"
            >
              Companies
            </h5>
          </li>
          <li className="navigation-item">
            <Icon
              type="fas fa-user-plus"
              color="#06ab00"
              tooltiptext="Add a driver"
              handleClick={clickIcon}
              id="addPerson"
            />
          </li>
          <li className="navigation-item">
            <Icon
              type="fas fa-print"
              color="#2499ff"
              tooltiptext="Print"
              id="printBack"
              handleClick={clickIcon}
            />
          </li>
          <li className="navigation-item">
            <Icon
              type="fal fa-table"
              color="#ff9500"
              tooltiptext="Take data in Excel"
              id="excel"
              handleClick={download}
            />
          </li>

          <li className="navigation-item">
            <input
              type="text"
              placeholder="Search..."
              name="search"
              id="searchInput"
              onChange={handleChange}
            />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;

function download() {
  fetch("http://localhost:9000/download", {
    method: "GET",
  })
    .then((res) => {
      if(res.status === 200){
        res.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = "Data.xlsx";
          a.click();
        });
      }
    })
    .catch((err) => console.log("error"));
}
