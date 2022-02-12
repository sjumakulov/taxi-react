import React, { useEffect } from "react";
import "./Frontpage.css";

function Frontpage({ person, company, setStates, putyovkaNum }) {
  let m = new Date().toLocaleString("Ru", { month: "long" });
  let month = m.replace(m[0], m[0].toUpperCase());
  let year = new Date().getFullYear();

  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 500);
    window.onafterprint = () => {
      setStates((pv) => {
        return {
          ...pv,
          printFront: false,
        };
      });
    };
  }, [setStates]);

  return (
    <div className="frontpage-background">
      <div className="frontpage-wrap">
        <div className="front-left">
          <table>
            <tbody>
              <tr>
                <th>Сана</th>
                <th>Хайдовчи Ахволи</th>
                <th>Транспорт ҳолати</th>
                <th>Кунлик тўлов</th>
                <th>Чиқиш вақти</th>
                <th>Кириш вақти</th>
              </tr>
              {rows()}
            </tbody>
          </table>
          <div className="front-left-bottom">
            <h5>Ижара солиғини ўз вақтида тўлашни унутманг!</h5>
            <h5>Алохида белгилар ва огоҳлантиришлар:</h5>
            <hr />
            <hr />
            <hr />
            <hr />
            <hr />
            <hr />
          </div>
        </div>

        <div className="front-right">
          <div className="front-right-top">
            <div className="">
              <h5>
                «{month}» {year} йил
              </h5>
              <h5>Йўл Варақаси № {putyovkaNum}</h5>
            </div>
            <h4>{company}</h4>
            <img src={require("./car.PNG")} alt="car-img" />
          </div>
          <div className="front-right-bottom">
            <table>
              <tbody>
                <tr>
                  <td colSpan="2">
                    Йўналиш номи: <b>{person.route}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Ҳайдовчи: <b>{person.name}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Автомобил русуми: <b>{person.car_type}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Давлат рақами: <b>{person.car_num}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Ҳайдовчилик гувоҳномаси: <b>{person.license_num}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Тоифаси: <b>{person.license_category}</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    Лицензия АТ <b>№ {person.permission_num}</b>
                  </td>
                  <td>
                    Муддати: <b>{person.permission_expire_date}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Ижара шартнома муддати: <b>{person.contract_expire_date}</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    Полис муддати: <b>{person.polis_expire_date}</b>
                  </td>
                  <td>
                    Газ акт: <b>{person.gas_tank_expire_date}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Тех. Курик: <b>{person.checkup_expire_date}</b>
                  </td>
                </tr>
              </tbody>
            </table>
            <h5 className="dispecher-text">
              Диспетчер: _____________________ М.П
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Frontpage;

function rows() {
  let now = new Date(),
    year = now.getFullYear(),
    month = now.getMonth(),
    numOfdays = new Date(year, month + 1, 0).getDate();

  let rows = [];
  for (let i = 24; i <= numOfdays; i++) {
    let date = new Date(year, month, i)
      .toLocaleString("Ru", { dat: "2-digit" })
      .slice(0, 10);

    rows.push(
      <tr key={i + "row"}>
        <td className="td-date">{date}</td>
        <td className="td-stamp"></td>
        <td className="td-stamp"></td>
        <td className="td-stamp"></td>
        <td className="td-leaving-time"></td>
        <td className="td-leaving-time"></td>
      </tr>
    );
  }

  return rows;
}
