import React from "react";
import "./styles/Icon.css"

function Icon({color, tooltiptext, type, handleClick}) {
  return (
    <div className="my-tooltip">
      <i className= {type} style={{color:color}} onClick={handleClick}>
        <span className="my-tooltiptext">
          {tooltiptext}
        </span>
      </i>
    </div>
  );
}

export default Icon;
