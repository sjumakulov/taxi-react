import React, { useState, useEffect } from "react";
import Head from "./Head";
import Body from "./Body";
import "./styles/Person.css";

function Person({ data, person, clickIcon, fetchData, searchInput }) {
  let [bodyvisible, setBodyvisible] = useState(false);
  let [personVisible, setPersonVisible] = useState(true);

  function showBody(e) {
    if (!e.target.classList.value.includes("dont-show")) {
      setBodyvisible((pv) => {
        return !pv;
      });
    }
  }

  let personString = Object.keys(person)
    .map((key) => {
      if (
        key === "company_id" ||
        key === "person_id" ||
        key === "is_main_driver" ||
        key === "med_expire_date" ||
        key === "polis_expire_date" ||
        key === "contract_expire_date" ||
        key === "permission_expire_date" ||
        key === "gas_tank_expire_date" ||
        key === "checkup_expire_date" ||
        key === "work_contract_expire_date" ||
        key === "med_start_date" ||
        key === "polis_start_date" ||
        key === "contract_start_date" ||
        key === "permission_start_date" ||
        key === "gas_tank_start_date" ||
        key === "checkup_start_date" ||
        key === "work_contract_start_date"
      ) {
      } else {
        return person[key];
      }
    })
    .join("")
    .toLowerCase();

  useEffect(() => {
    if (personString.indexOf(searchInput.toLowerCase()) < 0) {
      setPersonVisible(false);
    } else {
      setPersonVisible(true);
    }
  }, [searchInput, personString]);
  return (
    personVisible && (
      <div className="person-div">
        <Head
          person={person}
          data={data}
          showBody={showBody}
          clickIcon={clickIcon}
          bodyvisible={bodyvisible}
          fetchData={fetchData}
        />
        {bodyvisible && (
          <Body person={person} data={data} fetchData={fetchData} />
        )}
      </div>
    )
  );
}

export default Person;
