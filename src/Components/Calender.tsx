import styled from "styled-components";

import RenderDays from "./RenderDays";
import RenderCells from "./RenderCells";

interface CalenderProps {
  currentDate: string;
}

export default function Calender({ currentDate }: CalenderProps) {
  return (
    <CalenderWrap>
      <RenderDays />
      <RenderCells currentDate={currentDate} />
    </CalenderWrap>
  );
}

const CalenderWrap = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;
