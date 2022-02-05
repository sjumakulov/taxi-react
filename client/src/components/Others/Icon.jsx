import React from "react";
import "./styles/Icon.css";

function Icon({ color, tooltiptext, type, handleClick, id, person }) {
  return (
    <div className="my-tooltip">
      <i
        className={type}
        style={{ color: color }}
        onClick={(e) => {
          handleClick(e, person);
        }}
        id={id}
      >
        <span className="my-tooltiptext">{tooltiptext}</span>
      </i>
    </div>
  );
}

export default Icon;
