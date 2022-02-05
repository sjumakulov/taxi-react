import React, {useState, memo} from "react";
import Head from "./Head";
import Body from "./Body";
import "./styles/Person.css";

function Person({data, person}) {
  let [bodyvisible, setBodyvisible]=useState(false);

  function 

  return (

    <div className="person-div">
      <Head person={person} data = {data}/>
      <Body person={person} data = {data}/>
    </div>

  );
}

export default Person;
