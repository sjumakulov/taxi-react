import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Popupform from "./components/Navbar/Popupform";
import Person from "./components/Person/Person";
import Frontpage from "./components/Print/Frontpage";
import Backpage from "./components/Print/Backpage";
import Stat from "./components/Navbar/Statistics";

function App() {
  const [data, setData] = useState({});
  let [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchData(); // Fetch games when component is mounted
  }, []);

  const fetchData = () => {
    fetch("http://localhost:9000/", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((result) => {
        setData(() => {
          return result;
        });
        setMounted(true);
      })
      .catch((err) => console.log("error"));
  };

  let [{ editPerson, addPerson, person, printBack, printFront }, setStates] =
    useState({
      editPerson: false,
      addPerson: false,
      person: {},
      printBack: false,
      printFront: false,
    });

  function clickIcon(e, person) {
    let icon_id = e.target.id;
    if (
      icon_id === "editPerson" ||
      icon_id === "deletePerson" ||
      icon_id === "editCompany" ||
      icon_id === "printFront"
    ) {
      setStates((pv) => {
        return {
          ...pv,
          [icon_id]: true,
          person: person,
        };
      });
    } else {
      setStates((pv) => {
        return {
          ...pv,
          [icon_id]: true,
        };
      });
    }
  }

  let [seeStat, setSeeStat] = useState(false);

  let [searchInput, setSearchInput] = useState("");

  return (
    <div className="App">
      <Navbar
        clickIcon={clickIcon}
        setSeeStat={setSeeStat}
        setSearchInput={setSearchInput}
      />
      {printFront && (
        <Frontpage
          setStates={setStates}
          person={person}
          company={data.companies[person.company_id].name}
          putyovkaNum={
            data.payment_status[person.car_num.replaceAll(" ", "")].putyovka_num
          }
        />
      )}
      {printBack && <Backpage setStates={setStates} />}
      {(editPerson || addPerson) && (
        <Popupform
          setStates={setStates}
          person={person}
          companies={data.companies}
          type={editPerson ? "edit" : "add"}
          cars={data.cars}
          fetchData={fetchData}
        />
      )}

      {seeStat && (
        <Stat setSeeStat={setSeeStat} data={data} fetchData={fetchData} />
      )}

      {mounted && (
        <Persons
          data={data}
          clickIcon={clickIcon}
          fetchData={fetchData}
          searchInput={searchInput}
        />
      )}
    </div>
  );
}

export default App;

function Persons({ data, clickIcon, fetchData, searchInput }) {
  let { persons, payment_history, payment_status, cars, companies, other } =
    data;
  let restOfdata = {
    payment_history: payment_history,
    payment_status: payment_status,
    cars: cars,
    companies: companies,
    price: other.price,
  };
  return (
    <div>
      {persons.map((person, index) => {
        return (
          <Person
            key={index + "per"}
            data={restOfdata}
            person={person}
            clickIcon={clickIcon}
            fetchData={fetchData}
            searchInput={searchInput}
          />
        );
      })}
    </div>
  );
}
