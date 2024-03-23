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

  const canAddDayOff = (dayToAdd: string) => {
    // 모든 직원의 휴무일을 담을 배열 생성
    const allDaysOff = employees.flatMap((employee) => employee.day_off);

    // 특정 휴무일의 중복 횟수 계산
    const dayCount = allDaysOff.reduce(
      (acc, day) => acc + (day === dayToAdd ? 1 : 0),
      0
    );

    // 중복 횟수가 dayOffMax보다 작거나 같으면 추가 가능
    return dayCount < parseInt(dayOffMax);
  };

  const updateEmployeeDayOff = (employeeName: string) => {
    const dayOffString = String(selectDayOff[employeeName]);

    if (!canAddDayOff(dayOffString)) {
      alert(`해당 날짜에는 이미 최대 휴무 인원이 배정되었습니다.`);
      return;
    }

    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) => {
        if (employee.name === employeeName) {
          // 직원의 휴무일 수가 dayOffNum을 초과하는지 검사
          if (!employee.day_off.includes(dayOffString)) {
            // 직원의 휴무일 수가 dayOffNum을 초과하는지 검사
            if (employee.day_off.length < parseInt(dayOffNum)) {
              return {
                ...employee,
                day_off: [...employee.day_off, dayOffString],
              };
            } else {
              alert(
                `${employeeName}의 휴무일이 이미 최대 개수에 도달했습니다.`
              );
            }
          } else {
            // 중복된 휴무일인 경우 경고 메시지 표시
            alert(
              `${employeeName}의 휴무일 중에 이미 ${dayOffString}이(가) 있습니다.`
            );
          }
        }
        return employee;
      })
    );

    console.log(employees);
  };

  const deleteEmployeeName = (employeeNameToDelete: string) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.name !== employeeNameToDelete)
    );
  };

  const deleteEmployeeDayOff = (
    employeeName: string,
    dayOffToDelete: string
  ) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) => {
        if (employee.name === employeeName) {
          const newDayOff = employee.day_off.filter(
            (dayOff) => dayOff !== dayOffToDelete
          );
          return { ...employee, day_off: newDayOff };
        }
        return employee;
      })
    );
  };

  const getTotalDaysInMonth = (dateString: string) => {
    const [year, month] = dateString.split("-").map(Number);
    return new Date(year, month, 0).getDate();
  };

  const fillRandomDayOffs = () => {
    const totalDays = getTotalDaysInMonth(currentDate);
    let dayOffAllocation = new Array(totalDays).fill(0);

    employees.forEach((employee) => {
      employee.day_off.forEach((dayOff) => {
        const day = parseInt(dayOff) - 1;
        if (day >= 0 && day < totalDays) {
          // 초기 휴무일 할당을 추적합니다.
          dayOffAllocation[day]++;
        }
      });
    });

    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) => {
        let currentDayOffs = [...employee.day_off];
        const dayInterval = Math.ceil(totalDays / parseInt(dayOffNum)) - 1;
        while (currentDayOffs.length < parseInt(dayOffNum)) {
          let attempts = 0;
          let added = false;

          while (!added && attempts < totalDays * 2) {
            const randomDay = Math.floor(Math.random() * totalDays) + 1;
            if (
              dayOffAllocation[randomDay - 1] < parseInt(dayOffMax) &&
              isValidDayOff(randomDay, currentDayOffs, dayInterval)
            ) {
              currentDayOffs.push(randomDay.toString());
              dayOffAllocation[randomDay - 1]++;
              added = true;
            }
            attempts++;
          }

          if (!added) {
            // 모든 시도 후에도 새로운 휴무일을 추가할 수 없다면 루프를 종료합니다.
            break;
          }
        }

        return {
          ...employee,
          day_off: currentDayOffs.sort((a, b) => parseInt(a) - parseInt(b)),
        };
      })
    );
  };

  const isValidDayOff = (
    day: number,
    currentDayOffs: string[],
    dayInterval: number
  ) => {
    return currentDayOffs.every(
      (off) => Math.abs(day - parseInt(off)) >= dayInterval
    );
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fillRandomDayOffs();
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
        <FormData onSubmit={handleSubmit}>
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
          <p>직원 목록:</p>
          {employees.length > 0 && (
            <ul>
              {employees.map((employee) => (
                <li key={employee.name}>
                  {employee.name}
                  <button
                    type="button"
                    onClick={() => deleteEmployeeName(employee.name)}
                  >
                    삭제
                  </button>
                </li>
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

                <p>휴무일: </p>
                <ul>
                  {employee.day_off.map((day, index) => (
                    <li key={index}>
                      {day}일
                      <button
                        type="button"
                        onClick={() => deleteEmployeeDayOff(employee.name, day)}
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          <button type="submit">입력완료</button>
        </FormData>

        <Calender currentDate={currentDate} employees={employees} />
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
