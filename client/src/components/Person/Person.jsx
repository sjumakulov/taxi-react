import React, { useState, memo } from "react";
import Head from "./Head";
import Body from "./Body";
import "./styles/Person.css";

function Person({ data, person, clickIcon }) {
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
      />
      {bodyvisible && <Body person={person} data={data} />}
    </div>
  );
}

export default Person;
