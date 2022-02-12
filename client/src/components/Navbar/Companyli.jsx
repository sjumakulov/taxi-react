import React, { useState, useRef, useEffect } from "react";

function Companyli({ company, fetchData, data }) {
  let [editCompany, setEditCompany] = useState(false);
  let [companyInfo, setCompanyInfo] = useState(company);

  const companyRef = useRef(null);
  useOutsideAlerter(
    companyRef,
    setEditCompany,
    companyInfo,
    company,
    fetchData
  );

  function handleChange(e) {
    let { name, value } = e.target;
    setCompanyInfo((pv) => {
      return {
        ...pv,
        [name]: value,
      };
    });
  }
  return (
    <li className="company-li" ref={companyRef}>
      <input
        type="text"
        value={companyInfo.name}
        disabled={!editCompany}
        className={editCompany ? "input-enabled" : "input-disabled"}
        onChange={handleChange}
        name="name"
        style={{ color: editCompany ? "blue" : "black" }}
      />
      <input
        type={"color"}
        disabled={!editCompany}
        value={companyInfo.color}
        onChange={handleChange}
        name="color"
      />
      <i
        className="fas fa-pencil"
        onClick={() => {
          setEditCompany(true);
        }}
      ></i>

      <ul>
        <li>
          Хайдовчилар сони <br />
          <h5>{statistics(data)[company.company_id].numOfDrivers}</h5>
        </li>
        <li>
          Машиналар сони <br />
          <h5>{statistics(data)[company.company_id].numOfCars}</h5>
        </li>
        <li>
          Путёвка олган машиналар сони <br />
          <h5>{statistics(data)[company.company_id].numOfPermittedCars}</h5>
        </li>
        <li>
          Қарздорлиги бор машиналар сони <br />
          <h5>{statistics(data)[company.company_id].numOfCarsWithDebt}</h5>
        </li>
      </ul>
    </li>
  );
}

export default Companyli;

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, setState, inputData, oldData, fetchData) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleSubmit(inputData, oldData, fetchData);
        setState(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setState, fetchData, inputData, oldData]);
}

function handleSubmit(inputData, oldData, fetchData) {
  if (oldData.name !== inputData.name || oldData.color !== inputData.color) {
    fetch("http://localhost:9000/company", {
      method: "PUT",
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
          }, 50);
        }
        // ====================
      })
      .catch((err) => console.log(err));
  }
}

// function that calculates statistics:
function statistics(data) {
  let { persons, payment_status, companies, other } = data;
  let info = {};

  Object.keys(companies).map((companyID) => {
    let cars = [];
    info[companyID] = {
      numOfDrivers: 0,
      numOfCars: 0,
      numOfPermittedCars: 0,
      numOfCarsWithDebt: 0,
    };
    persons.map((person) => {
      if (person.company_id === companyID) {
        info[companyID]["numOfDrivers"]++;

        let carID = person.car_num.replaceAll(" ", "");
        if (!cars.includes(carID)) {
          info[companyID]["numOfCars"]++;
          if (payment_status[carID].putyovka_given === true) {
            info[companyID]["numOfPermittedCars"]++;

            if (
              parseInt(payment_status[carID].balance) < parseInt(other.price)
            ) {
              // console.log(payment_status[carID].balance)
              // console.log(parseInt(other.price))

              info[companyID]["numOfCarsWithDebt"]++;
            }
          }
          cars.push(carID);
        }
      }
      return null;
    });
    return null;
  });
  return info;
}
