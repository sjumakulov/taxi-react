import React, { useEffect } from "react";
import "./Backpage.css";

function Backpage({ setStates }) {
  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 500);
    
    window.onafterprint = () => {
      console.log("print done")
      setStates((pv) => {
        return {
          ...pv,
          printBack: false,
        };
      });
    };
    
  }, [setStates]);
  return (
    <div className="backpage-background">
      <div className="backpage-wrap">
        <div className="back-half">
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
              {rows()[0]}
            </tbody>
          </table>
        </div>
        <div className="back-half">
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
              {rows()[1]}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Backpage;

function rows() {
  let now = new Date(),
    year = now.getFullYear(),
    month = now.getMonth();

  let half_1 = [];
  for (let i = 1; i <= 12; i++) {
    let date = new Date(year, month + 1, i)
      .toLocaleString("Ru", { dat: "2-digit" })
      .slice(0, 10);

    half_1.push(
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

  let half_2 = [];
  for (let i = 13; i <= 24; i++) {
    let date = new Date(year, month, i)
      .toLocaleString("Ru", { dat: "2-digit" })
      .slice(0, 10);

    half_2.push(
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

  return [half_1, half_2];
}
