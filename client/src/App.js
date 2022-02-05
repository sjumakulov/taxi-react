import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Person from "./components/Person/Person";

function App() {
  const [data, setData] = useState({});
  let [mounted, setMounted] = useState(false);
  // const [formData, setFormData] = useState("");

  useEffect(() => {
    fetchData(); // Fetch games when component is mounted
  }, []);

  const fetchData = () => {
    fetch("http://localhost:9000/", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setMounted(true);
      })
      .catch((err) => console.log("error"));
  };

  // console.log(data)
  // Persons();
  // console.log(data);
  // const saveGames = () => {
  //   fetch("http://localhost:9000/game", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       name: formData, // Use your own property name / key
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((result) => setData(result.rows))
  //     .catch((err) => console.log("error"));
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   saveGames(); // Save games when form is submitted
  // };

  // const handleChange = (event) => {
  //   setFormData(event.target.value);
  // };

  return (
    <div className="App">
      <Navbar />
      {mounted && Persons(data)}
    </div>
  );
}

export default App;

function Persons(data) {
  let { persons, payment_history, payment_status, cars, companies, other } =
    data;
  let restOfdata = {
    payment_history: payment_history,
    payment_status: payment_status,
    cars: cars,
    companies: companies,
    price: other.price,
  };

  return persons.map((person, index) => {
    return <Person key={index + "per"} data={restOfdata} person={person}/>;
  });
}
