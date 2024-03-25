import styled from "styled-components";

import RenderDays from "./RenderDays";
import RenderCells from "./RenderCells";
import { EmployeeData } from "../type";

interface CalenderProps {
  currentDate: string;
  employees: EmployeeData[];
}

export default function Calender({ currentDate, employees }: CalenderProps) {
  const [year, month] = currentDate.split("-");

  return (
    <CalenderWrap>
      <p className="year-month">
        {year}년 {month}월
      </p>
      <RenderDays />
      <RenderCells currentDate={currentDate} employees={employees} />
    </CalenderWrap>
  );
}

const CalenderWrap = styled.article`
  min-width: 700px;
  display: flex;
  flex-direction: column;
  width: 100%;

  gap: 10px;

  .year-month {
    font-size: 1.6rem;
    font-weight: 700;
    color: white;
    text-align: end;
    background: ${(props) => props.theme.accentColor};
    border-radius: 10px;
    padding: 8px 10px;

    line-height: 1.2;
  }
`;
