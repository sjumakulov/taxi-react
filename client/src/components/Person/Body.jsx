import "./styles/Body.css";
import Datacell from "./Datacell";

function Body({ person, data }) {
  let company = data.companies[person.company_id].name;

  return (
    <div className="body">
      <div className="body-left-div">
        <table>
          <tbody>
            <tr>
              <td>
                <Datacell
                  label="Лицензия АТ №:"
                  value={person.permission_num}
                />
              </td>
              <td>
                <Datacell
                  label="Лицензия муддати:"
                  value={person.permission_expire_date}
                  progress={true}
                  startDate={person.gas_tank_start_date}
                />
              </td>
              <td>
                <Datacell
                  label="Тиббий кўрик муддати:"
                  value={person.med_expire_date}
                  progress={true}
                  startDate={person.gas_tank_start_date}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Datacell label="Автомобил русуми:" value={person.car_type} />
              </td>
              <td>
                <Datacell
                  label="Тех. курик муддат:"
                  value={person.checkup_expire_date}
                  progress={true}
                  startDate={person.gas_tank_start_date}
                />
              </td>
              <td>
                <Datacell
                  label="Меҳнат шартнома муддати:"
                  value={person.work_contract_expire_date}
                  progress={true}
                  startDate={person.gas_tank_start_date}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Datacell label="Йўналиш номи:" value={person.route} />
              </td>
              <td>
                <Datacell
                  label="Ижара шартнома муддати:"
                  value={person.contract_expire_date}
                  progress={true}
                  startDate={person.gas_tank_start_date}
                />
              </td>
              <td>
                <Datacell label="Манзил" value={person.address} />
              </td>
            </tr>
            <tr>
              <td>
                <Datacell label="Фирма номи:" value={company} />
              </td>
              <td>
                <Datacell
                  label="Полис муддати:"
                  value={person.polis_expire_date}
                  progress={true}
                  startDate={person.gas_tank_start_date}
                />
              </td>
              <td>
                <Datacell label="Телефон:" value={person.phone} />
              </td>
            </tr>
            <tr>
              <td>
                <Datacell
                  classes="pass-data"
                  label="Паспорт Малумотлари"
                  value={
                    <ul>
                      <li>{person.pass_num}</li>
                      <li>{person.pass_giving_auth}</li>
                      <li>
                        <b>Берилган сана:</b>
                        <span>{person.pass_given_date}</span>
                      </li>
                    </ul>
                  }
                />
              </td>
              <td>
                <Datacell
                  label="Газ балон муддат:"
                  value={person.gas_tank_expire_date}
                  progress={true}
                  startDate={person.gas_tank_start_date}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="body-right-div"></div>
    </div>
  );
}

export default Body;
