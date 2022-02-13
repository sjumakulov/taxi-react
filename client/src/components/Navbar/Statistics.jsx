import React, { useRef, useEffect, useState } from "react";
import "./styles/Statistics.css";
import Companyli from "./Companyli";

function Stat({ setSeeStat, data, fetchData }) {
  const statRef = useRef(null);
  useOutsideAlerter(statRef, setSeeStat, "stat");

  let companies = data.companies;

  let [addingCompany, setAddingCompany] = useState(false);
  const addCompanyRef = useRef(null);
  useOutsideAlerter(addCompanyRef, setAddingCompany, "company");

  let [addCompanyInfo, setAddCompanyInfo] = useState({
    color: randomColor(),
    name: "",
  });

  let [{ price, editingPrice }, setPriceStates] = useState({
    price: parseInt(data.other.price),
    editingPrice: false,
  });

  function handleChange(e) {
    let { name, value } = e.target;
    if (name !== "price") {
      setAddCompanyInfo((pv) => {
        return {
          ...pv,
          [name]: value,
        };
      });
    } else {
      setPriceStates((pv) => {
        return { ...pv, price: value };
      });
    }
  }

  const priceRef = useRef(null);
  useOutsideAlerter(
    priceRef,
    setPriceStates,
    "price",
    parseInt(price),
    parseInt(data.other.price),
    fetchData
  );

  return (
    <div className="stat-wrap" ref={statRef}>
      <div className="stat-top">
        <div className="price-div">
          <label>
            <h5>Нарх:</h5>
          </label>
          <span
            onClick={() => {
              setPriceStates((pv) => {
                return { ...pv, editingPrice: true };
              });
            }}
            ref={priceRef}
          >
            <input
              type={"number"}
              value={price}
              className={editingPrice ? "input-enabled" : "input-disabled"}
              disabled={!editingPrice}
              name="price"
              onChange={handleChange}
              style={{ color: editingPrice ? "blue" : "black" }}
            />
          </span>
        </div>
        <div>
          {addingCompany ? (
            <div ref={addCompanyRef} className="add-company-div">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        value={addCompanyInfo.name}
                        onChange={handleChange}
                        className="input-enabled"
                        name="name"
                        placeholder="Фирма номини киритинг..."
                      />
                    </td>
                    <td>
                      <input
                        type={"color"}
                        value={addCompanyInfo.color}
                        onChange={handleChange}
                        name="color"
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-success"
                        style={{ border: "none" }}
                      >
                        <i
                          className="fas fa-check"
                          onClick={() => {
                            handleSubmit(addCompanyInfo, fetchData, "company");
                          }}
                        ></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <button
              className="btn btn-sm btn-outline-success"
              style={{ border: "none" }}
              onClick={() => {
                setAddingCompany(true);
              }}
            >
              <i className="fas fa-plus"></i>
            </button>
          )}
        </div>
      </div>

      <hr />

      <ol className="stat-body">
        {Object.keys(companies).map((companyID) => {
          return (
            <Companyli
              key={companyID}
              company={{ company_id: companyID, ...companies[companyID] }}
              fetchData={fetchData}
              data={data}
            />
          );
        })}
      </ol>
    </div>
  );
}

export default Stat;

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, setState, type, newPrice, oldPrice, fetchData) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (type !== "price") {
          setState(false);
        } else if (type === "price") {
          setState((pv) => {
            return { ...pv, editingPrice: false };
          });
          if (newPrice !== oldPrice) {
            handleSubmit({ price: newPrice }, fetchData, "price");
          }
        }
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setState, newPrice, oldPrice, fetchData, type]);
}

function handleSubmit(inputData, fetchData, type) {
  if (type === "price" || (type === "company" && inputData.name !== "")) {
    let method = type === "price" ? "PUT" : "POST",
      route = type === "price" ? "/price" : "/companies";
    fetch("http://localhost:9000" + route, {
      method: method,
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
          }, 100);
        }
        // ====================
      })
      .catch((err) => console.log(err));
  }
}

// random color generator:
function randomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
