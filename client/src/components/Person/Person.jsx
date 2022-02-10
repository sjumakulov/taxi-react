import React, { useState, memo } from "react";
import Head from "./Head";
import Body from "./Body";
import "./styles/Person.css";

function Person({ data, person, clickIcon, fetchData }) {
  let [bodyvisible, setBodyvisible] = useState(false);

  function showBody(e) {
    console.log()
    if(!e.target.classList.value.includes("dont-show")){
      setBodyvisible((pv) => {
        return !pv;
      });
    }

    
  }

  return (
    <div className="person-div">
      <Head
        person={person}
        data={data}
        showBody={showBody}
        clickIcon={clickIcon}
        bodyvisible={bodyvisible}
        fetchData={fetchData}
      />
      {bodyvisible && <Body person={person} data={data} fetchData={fetchData}/>}
    </div>
  );
}

export default Person;
