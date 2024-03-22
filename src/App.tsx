import React, { useState } from "react";
import styled from "styled-components";

import { GlobalStyle } from "./Styles/GlobalStyle";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./Styles/theme";
import { EmployeeData } from "./type";

import Calender from "./Components/Calender";

function App() {
  const [isDark, setIsDark] = useState(false);

  const [currentDate, setCurrentDate] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [selectDayOff, setSelectDayOff] = useState<{ [key: string]: string }>(
    {}
  );
  const [dayOffNum, setDayOffNum] = useState("");
  const [dayOffMax, setDayOffMax] = useState("");

  const [employees, setEmployees] = useState<EmployeeData[]>([]);

  const updateEmployeeName = () => {
    const newEmployee: EmployeeData = {
      name: employeeName,
      day_off: [],
    };
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    setEmployeeName("");
    console.log(employees);
  };

  const updateEmployeeDayOff = (employeeName: string) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.name === employeeName
          ? {
              ...employee,
              day_off: [...employee.day_off, selectDayOff[employeeName]],
            }
          : employee
      )
    );

    console.log(employees);
  };

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(e.target.value);
  };

  const handleEmployeeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeName(e.target.value);
  };

  const handleDayOffNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDayOffNum(e.target.value);
  };
  const handleDayOffMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDayOffMax(e.target.value);
  };

  const handleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <div>
        <p>다크모드</p>
        <button type="button" onClick={handleDarkMode}>
          클릭!
        </button>
      </div>

      <Main>
        <FormData>
          <label htmlFor="year-month">
            휴무 스케쥴을 제작할 년도와 월을 선택하세요.
          </label>
          <input
            type="month"
            id="year-month"
            value={currentDate}
            onChange={handleDate}
          />

          <label htmlFor="day-off-num">1인 월 휴무 개수를 입력해주세요.</label>
          <input
            type="number"
            id="day-off-num"
            value={dayOffNum}
            onChange={handleDayOffNum}
          />

          <label htmlFor="day-off-max">
            하루에 최대 몇명까지 휴무가 가능한가요?
          </label>
          <input
            type="number"
            id="day-off-max"
            value={dayOffMax}
            onChange={handleDayOffMax}
          />

          <label htmlFor="employee-name">
            휴무 일정을 배정할 직원을 작성해 주세요.
          </label>
          <div>
            <input
              type="text"
              id="employee-name"
              value={employeeName}
              onChange={handleEmployeeName}
            />

            <button type="button" onClick={updateEmployeeName}>
              추가
            </button>
          </div>
          <p>직원 리스트:</p>
          {employees.length > 0 && (
            <ul>
              {employees.map((employee) => (
                <li key={employee.name}>{employee.name}</li>
              ))}
            </ul>
          )}

          <label htmlFor="day-off-select">
            각 직원별로 지정 휴무일이 있다면 작성해주세요.
          </label>

          {employees.length > 0 &&
            employees.map((employee) => (
              <div key={employee.name} id="day-off-select">
                <div>
                  <p>{employee.name}</p>
                  <input
                    type="number"
                    id={employee.name}
                    value={selectDayOff[employee.name] || ""}
                    onChange={(e) =>
                      setSelectDayOff({
                        ...selectDayOff,
                        [employee.name]: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => updateEmployeeDayOff(employee.name)}
                  >
                    추가
                  </button>
                </div>

                <p>지정 휴무일: </p>
                <ul>
                  {employee.day_off.map((day, index) => (
                    <li key={index}>{day}일</li>
                  ))}
                </ul>
              </div>
            ))}

          <button type="submit">입력완료</button>
        </FormData>

        <Calender currentDate={currentDate} />
      </Main>
    </ThemeProvider>
  );
}
export default App;

const Main = styled.section`
  display: flex;
  gap: 20px;
`;

const FormData = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
