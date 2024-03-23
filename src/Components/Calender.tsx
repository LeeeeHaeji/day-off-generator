import styled from "styled-components";

import RenderDays from "./RenderDays";
import RenderCells from "./RenderCells";
import { EmployeeData } from "../type";

interface CalenderProps {
  currentDate: string;
  employees: EmployeeData[];
}

export default function Calender({ currentDate, employees }: CalenderProps) {
  return (
    <CalenderWrap>
      <RenderDays />
      <RenderCells currentDate={currentDate} employees={employees} />
    </CalenderWrap>
  );
}

const CalenderWrap = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;
