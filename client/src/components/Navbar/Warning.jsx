import React from "react";
import "./styles/Warning.css";

function Warning({ setDeleting, person_id, fetchData }) {

  function handleClick(e){
    let type = e.target.type;
    if(type==="submit"){
      fetch("http://localhost:9000/person", {
        method: "DELETE",
        body: JSON.stringify({person_id:person_id}),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Accept: "application/json; charset=UTF-8",
        },
      })
        .then((response) =>{
          if (response.status === 200) {
            setTimeout(() => {
              fetchData();
            }, 50);
            }
        })
        .catch((err) => console.log(err));
    }
    setDeleting(false);
  }


  return (
    <div className="warning-background dont-show">
      <div className="warning-wrap dont-show">
        <h6 className="dont-show">Ростдан ҳам бу маълумотни ўчиришни ҳохлайсизми?</h6>
        <button type="button" onClick={handleClick} className="btn btn-success dont-show">
          {" "}
          Ёъқ{" "}
        </button>
        <button type="submit" onClick={handleClick} className="btn btn-outline-danger dont-show">
          {" "}
          Ҳа{" "}
        </button>
      </div>
    </div>
  );
}

export default Warning;
