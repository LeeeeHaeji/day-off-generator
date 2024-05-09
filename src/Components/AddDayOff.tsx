import React, { useState, useRef, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { ColorResult, ChromePicker } from "react-color";
import rgbHex from "rgb-hex";

import styled from "styled-components";
import { EmployeeData } from "@/src/type";
import { inputDataAtom } from "../Recoil/inputDataAtom";

import deleteBtn from "../assets/images/delete.png";
import deleteDarkBtn from "../assets/images/delete-dark.png";

import palette from "../assets/images/palette.png";

interface AddDayOffProps {
  updateEmployees: (
    updateFunction: (prevEmployees: EmployeeData[]) => EmployeeData[]
  ) => void;
}

export default function AddDayOff({ updateEmployees }: AddDayOffProps) {
  const { employees, dayOffNum, dayOffMax } = useRecoilValue(inputDataAtom);
  const [selectDayOff, setSelectDayOff] = useState<{ [key: string]: string }>(
    {}
  );

  // 직원별 배경색
  const nameRefs = useRef<{ [key: string]: HTMLParagraphElement | null }>({});

  const [colorPickerOffsets, setColorPickerOffsets] = useState<{
    [key: string]: number;
  }>({});

  const [colorPicker, setColorPicker] = useState<{
    [key: string]: { isOpen: boolean; color: string };
  }>({});

  useEffect(() => {
    const offsets: { [key: string]: number } = {};
    employees.forEach((employee) => {
      const element = nameRefs.current[employee.name];
      if (element) {
        offsets[employee.name] = element.offsetWidth + 35;
      }
    });
    setColorPickerOffsets(offsets);
  }, [employees]);

  const toggleColorPicker = (employeeName: string) => {
    const isPickerOpen = colorPicker[employeeName]?.isOpen || false;
    const currentColor =
      colorPicker[employeeName]?.color ||
      employees.find((emp) => emp.name === employeeName)?.bg_color ||
      "#FFFFFF";

    setColorPicker((prev) => ({
      ...prev,
      [employeeName]: {
        isOpen: !isPickerOpen,
        color: currentColor,
      },
    }));
  };

  const closeColorPicker = (employeeName: string) => {
    setColorPicker((prev) => ({
      ...prev,
      [employeeName]: {
        ...prev[employeeName],
        isOpen: false,
      },
    }));
  };

  // const canAddDayOff = (dayToAdd: string) => {
  //   // 모든 직원의 휴무일을 담을 배열 생성
  //   const allDaysOff = employees.flatMap((employee) => employee.day_off);

  //   // 특정 휴무일의 중복 횟수 계산
  //   const dayCount = allDaysOff.reduce(
  //     (acc, day) => acc + (day === dayToAdd ? 1 : 0),
  //     0
  //   );

  //   // 중복 횟수가 dayOffMax보다 작거나 같으면 추가 가능
  //   return dayCount < parseInt(dayOffMax);
  // };

  const updateFixDayOff = (employeeName: string) => {
    const fixDayOff = String(selectDayOff[employeeName]);
    updateDayOff(employeeName, fixDayOff, undefined);
  };

  const updaterandomDayOff = (employeeName: string) => {
    const randomDayOff = String(selectDayOff[employeeName]);
    updateDayOff(employeeName, undefined, randomDayOff);
  };

  const updateDayOff = (
    employeeName: string,
    newFixDayOff?: string,
    newrandomDayOff?: string
  ) => {
    updateEmployees((prevEmployees) =>
      prevEmployees.map((employee) => {
        if (employee.name === employeeName) {
          const updatedFixDayOff = newFixDayOff
            ? [...employee.fix_day_off, newFixDayOff]
            : employee.fix_day_off;
          const updatedrandomDayOff = newrandomDayOff
            ? [...employee.random_day_off, newrandomDayOff]
            : employee.random_day_off;

          const allDaysOff = [...updatedFixDayOff, ...updatedrandomDayOff];

          // 이미 등록된 휴무일인지 확인
          if (newFixDayOff && employee.day_off.includes(newFixDayOff)) {
            alert(
              `${employeeName}의 휴무일 중에 이미 ${newFixDayOff}가 있습니다.`
            );
            return employee;
          }
          if (newrandomDayOff && employee.day_off.includes(newrandomDayOff)) {
            alert(
              `${employeeName}의 휴무일 중에 이미 ${newrandomDayOff}가 있습니다.`
            );
            return employee;
          }

          // 최대 휴무 인원을 넘지 않는지 확인
          const dayCount = allDaysOff.reduce(
            (acc, day) =>
              acc + (day === newFixDayOff || day === newrandomDayOff ? 1 : 0),
            0
          );

          if (dayCount > parseInt(dayOffMax)) {
            alert(`해당 날짜에는 이미 최대 휴무 인원이 배정되었습니다.`);
            return employee;
          }

          if (allDaysOff.length > parseInt(dayOffNum)) {
            alert(`${employeeName}의 휴무일이 이미 최대 개수에 도달했습니다.`);
            return employee;
          }

          return {
            ...employee,
            fix_day_off: updatedFixDayOff,
            random_day_off: updatedrandomDayOff,
            day_off: allDaysOff,
          };
        }
        return employee;
      })
    );
  };

  const updateColor = (employeeName: string, colorResult: ColorResult) => {
    const alpha = colorResult.rgb.a ?? 1; // 0-1을 0-255 범위로 변환
    const colorHex =
      "#" +
      rgbHex(colorResult.rgb.r, colorResult.rgb.g, colorResult.rgb.b, alpha);

    setColorPicker((prevColorPicker) => ({
      ...prevColorPicker,
      [employeeName]: {
        ...prevColorPicker[employeeName],
        color: colorHex,
      },
    }));

    updateEmployeeColor(employeeName, colorHex);
  };

  const updateEmployeeColor = (employeeName: string, color: string) => {
    updateEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.name === employeeName
          ? { ...employee, bg_color: color }
          : employee
      )
    );
  };

  const deleteFixDayOff = (employeeName: string, dayOffToDelete: string) => {
    updateEmployees((prevEmployees) =>
      prevEmployees.map((employee) => {
        if (employee.name === employeeName) {
          const updatedFixDayOff = employee.fix_day_off.filter(
            (dayOff) => dayOff !== dayOffToDelete
          );
          const updatedDayOff = employee.day_off.filter(
            (dayOff) => dayOff !== dayOffToDelete
          );
          return {
            ...employee,
            fix_day_off: updatedFixDayOff,
            day_off: updatedDayOff,
          };
        }
        return employee;
      })
    );
  };

  const deleterandomDayOff = (employeeName: string, dayOffToDelete: string) => {
    updateEmployees((prevEmployees) =>
      prevEmployees.map((employee) => {
        if (employee.name === employeeName) {
          const updatedrandomDayOff = employee.random_day_off.filter(
            (dayOff) => dayOff !== dayOffToDelete
          );
          const updatedDayOff = employee.day_off.filter(
            (dayOff) => dayOff !== dayOffToDelete
          );
          return {
            ...employee,
            random_day_off: updatedrandomDayOff,
            day_off: updatedDayOff,
          };
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
                <EmployeeName bg_color={employee.bg_color}>
                  <p ref={(el) => (nameRefs.current[employee.name] = el)}>
                    {employee.name}
                  </p>
                  <button
                    className="bg-change"
                    onClick={() => toggleColorPicker(employee.name)}
                  >
                    <img src={palette} alt="직원 배경색 변경 아이콘" />
                  </button>

                  {colorPicker[employee.name]?.isOpen && (
                    <PickerWrap
                      leftoffset={colorPickerOffsets[employee.name] || 0}
                    >
                      <ChromePicker
                        color={colorPicker[employee.name].color}
                        onChangeComplete={(colorResult) =>
                          updateColor(employee.name, colorResult)
                        }
                      />
                      <button onClick={() => closeColorPicker(employee.name)}>
                        <img src={deleteDarkBtn} alt="" />
                      </button>
                    </PickerWrap>
                  )}
                </EmployeeName>

                <input
                  type="number"
                  placeholder="휴무일을 입력해주세요."
                  id={employee.name}
                  value={selectDayOff[employee.name] || ""}
                  onChange={(e) =>
                    setSelectDayOff({
                      ...selectDayOff,
                      [employee.name]: e.target.value,
                    })
                  }
                />

                <div className="button-list">
                  <button
                    type="button"
                    onClick={() => updateFixDayOff(employee.name)}
                  >
                    지정 휴무일 추가
                  </button>
                  <button
                    type="button"
                    onClick={() => updaterandomDayOff(employee.name)}
                  >
                    랜덤 휴무일 추가
                  </button>
                </div>
              </div>

              <DayOffList>
                <div className="fix-day-off">
                  <p className="list-name">지정 휴무일</p>
                  <ul>
                    {employee.fix_day_off.map((day, index) => (
                      <DayOffListItem key={index}>
                        <p>{day}일</p>
                        <button
                          type="button"
                          onClick={() => deleteFixDayOff(employee.name, day)}
                        >
                          <img src={deleteBtn} alt="" />
                        </button>
                      </DayOffListItem>
                    ))}
                  </ul>
                </div>
                <span></span>
                <div className="random-day-off">
                  <p className="list-name">랜덤 휴무일</p>
                  <ul>
                    {employee.random_day_off.map((day, index) => (
                      <DayOffListItem key={index}>
                        <p>{day}일</p>
                        <button
                          type="button"
                          onClick={() => deleterandomDayOff(employee.name, day)}
                        >
                          <img src={deleteBtn} alt="" />
                        </button>
                      </DayOffListItem>
                    ))}
                  </ul>
                </div>
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
    font-size: 2rem;
    width: content-fit;
    margin: auto;

    padding: 20px 0;

    @media (min-width: 1024px) {
      grid-column: 2 / 3;
    }
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

  @media (min-width: 910px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1500px) {
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
    gap: 10px;
  }

  .button-list {
    display: flex;
    gap: 10px;
    button {
      width: 100%;
      height: 48px;
      font-weight: 700;
    }
  }

  input {
    width: 100%;
    border: none;
    border-radius: 5px;
    height: 40px;

    font-size: 1.4rem;
    padding: 0 10px;
    background: ${(props) => props.theme.inputBgColor};
  }

  .add-button {
    width: 100px;
  }
`;

const EmployeeName = styled.div<{ bg_color: string }>`
  position: relative;

  display: flex;
  gap: 5px;
  align-items: center;

  .bg-change {
    padding: 0px;
    background: transparent;

    img {
      width: 25px;
      height: 25px;
    }
  }
  .bg-color {
    width: 25px;
    height: 25px;
    background: ${(props) => props.bg_color};
    border: 2px dotted white;
    border-radius: 50%;
  }

  p {
    line-height: 30px;

    background: ${(props) => props.bg_color};
    border: 1px dashed white;
    padding: 2px 10px 0;
    border-radius: 50px;
  }
`;

const PickerWrap = styled.div<{ leftoffset: number }>`
  padding: 10px 5px 10px 10px;
  position: absolute;

  top: 0;
  left: ${(props) => props.leftoffset}px;
  background: white;

  display: flex;
  align-items: flex-start;
  gap: 10px;

  button {
    img {
      width: 30px;
      height: 30px;
    }

    background: transparent;
    padding: 0 2px;
  }

  border: 2px solid ${(props) => props.theme.accentColor};

  border-radius: 5px;
  z-index: 10;

  box-shadow: none;
`;

const DayOffList = styled.div`
  height: 210px;
  background: ${(props) => props.theme.inputBgColor};
  padding: 10px;
  display: flex;
  flex-direction: column;

  border-radius: 5px;
  gap: 8px;

  p {
    font-size: 1.6rem;
  }

  .list-name {
    color: #262624;
  }

  .fix-day-off,
  .random-day-off {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    overflow: hidden;
    padding: 5px;
  }

  div {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  ul {
    flex-grow: 1;
    max-height: 80px;
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    &::-webkit-scrollbar {
      width: 12px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${(props) => props.theme.accentColor};
      border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
      background: ${(props) => props.theme.scrollColor};
      border-radius: 10px;
    }
  }

  span {
    height: 4px;
    background: ${(props) => props.theme.accentBgColor};
    border-radius: 10px;
    flex-shrink: 0;
  }
`;

const DayOffListItem = styled.li`
  width: fit-content;
  height: 30px;
  display: flex;
  align-items: center;
  padding: 4px 5px 4px 9px;
  border-radius: 50px;
  gap: 0px;
  background-color: ${(props) => props.theme.dayOffListBgColor};

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
