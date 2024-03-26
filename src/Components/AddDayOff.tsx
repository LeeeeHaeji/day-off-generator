import React, { useState } from "react";

import styled from "styled-components";
import { EmployeeData } from "@/src/type";
import deleteBtn from "../assets/images/delete.png";

interface AddDayOffProps {
  employees: EmployeeData[];
  updateEmployees: (
    updateFunction: (prevEmployees: EmployeeData[]) => EmployeeData[]
  ) => void;
  dayOffNum: string; // 추가됨
  dayOffMax: string; // 추가됨
}

export default function AddDayOff({
  employees,
  updateEmployees,
  dayOffNum,
  dayOffMax,
}: AddDayOffProps) {
  const [selectDayOff, setSelectDayOff] = useState<{ [key: string]: string }>(
    {}
  );
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

    updateEmployees((prevEmployees) =>
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

  const deleteEmployeeDayOff = (
    employeeName: string,
    dayOffToDelete: string
  ) => {
    updateEmployees((prevEmployees) =>
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

  return (
    <AddDayOffWrap>
      <div className="text-wrap">
        <h3>휴무일 지정하기</h3>
        <label htmlFor="day-off-select">
          각 직원별로 지정 휴무일이 있다면 추가해주세요. 직원의 휴무일을
          수동으로 바꿀 수도 있습니다.
        </label>
      </div>

      <EmployeesData>
        {employees.length > 0 ? (
          employees.map((employee, index) => (
            <EmployeesDataItem
              key={`${employee.name}-${index}`}
              id="day-off-select"
            >
              <div className="add-day-off">
                <p>{employee.name}</p>
                <div className="input-day-off">
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
                    className="add-button"
                    type="button"
                    onClick={() => updateEmployeeDayOff(employee.name)}
                  >
                    추가
                  </button>
                </div>
              </div>

              <DayOffList>
                <p>휴무일: </p>
                <ul>
                  {employee.day_off.map((day, index) => (
                    <DayOffListItem key={index}>
                      <p>{day}일</p>
                      <button
                        type="button"
                        onClick={() => deleteEmployeeDayOff(employee.name, day)}
                      >
                        <img src={deleteBtn} alt="" />
                      </button>
                    </DayOffListItem>
                  ))}
                </ul>
              </DayOffList>
            </EmployeesDataItem>
          ))
        ) : (
          <p className="empty-list">등록된 직원이 없습니다.</p>
        )}
      </EmployeesData>
    </AddDayOffWrap>
  );
}

const AddDayOffWrap = styled.div`
  background: ${(props) => props.theme.accentBgColor};
  width: 100%;
  padding: 16px 20px;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 2.2rem;
    color: white;
  }

  .text-wrap {
    display: flex;
    flex-direction: column;

    gap: 8px;

    border-bottom: 1px solid white;
    padding-bottom: 5px;

    @media (min-width: 1024px) {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  .empty-list {
    font-size: 2.2rem;
    grid-column: 2 / 3;
    width: content-fit;
    margin: auto;

    padding: 20px 0;

    // color: ${(props) => props.theme.accentColor};
  }
`;

const EmployeesData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;
  padding-right: 10px;
  overflow-y: auto;
  max-height: 438px;

  @media (min-width: 628px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.accentColor};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
  }
`;

const EmployeesDataItem = styled.ul`
  * {
    font-size: 1.6rem;
  }

  display: flex;
  flex-direction: column;
  gap: 10px;

  .add-day-off {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .input-day-off {
    display: flex;
    gap: 5px;
  }

  input {
    width: 100%;
    border: none;
    border-radius: 5px;
    height: 40px;

    font-size: 1.4rem;
    padding: 0 10px;
    background: ${(props) => props.theme.inputBGColor};
  }

  .add-button {
    width: 100px;
  }
`;

const DayOffList = styled.div`
  height: 130px;
  background: ${(props) => props.theme.inputBGColor};

  padding: 10px;

  display: flex;
  flex-direction: column;

  border-radius: 10px;
  gap: 8px;

  p {
    font-size: 1.6rem;
  }

  ul {
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-right: 10px;
  }

  ul::-webkit-scrollbar {
    width: 12px;
  }

  ul::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.accentColor};
    border-radius: 10px;
  }

  ul::-webkit-scrollbar-track {
    background: ${(props) => props.theme.scrollColor};
    border-radius: 10px;
  }
`;

const DayOffListItem = styled.li`
  width: fit-content;
  display: flex;
  align-items: center;
  padding: 4px 5px 4px 9px;
  border-radius: 50px;
  gap: 0px;
  background-color: rgba(140, 140, 135, 0.6);

  p {
    margin-top: 3px;
    line-height: 1.2;
  }

  button {
    padding: 0;
    background: transparent;

    img {
      width: 14px;
      height: 14px;
    }
  }
`;
