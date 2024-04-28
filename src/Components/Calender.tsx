import styled from "styled-components";
import { useRecoilValue } from "recoil";

import RenderDays from "./RenderDays";
import RenderCells from "./RenderCells";
import { inputDataAtom } from "../Recoil/inputDataAtom";

export default function Calender() {
  const { currentDate, employees } = useRecoilValue(inputDataAtom);

  const [year, month] = currentDate.split("-");

  const emptyCells = () => {
    const cells = [];
    const result = [];
    for (let i = 0; i < 7; i++) {
      cells.push(<span className="col" key={i}></span>);
    }

    for (let i = 0; i < 5; i++) {
      result.push(
        <div className="row" key={i}>
          {cells}
        </div>
      );
    }
    return result;
  };

  return (
    <CalenderWrap>
      <p className="year-month">
        {year}년 {month}월
      </p>
      <RenderDays />

      {currentDate ? (
        <RenderCells />
      ) : (
        <div className="emptyCells">{emptyCells()}</div>
      )}
    </CalenderWrap>
  );
}

const CalenderWrap = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  gap: 10px;

  .year-month {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    text-align: end;
    background: ${(props) => props.theme.accentColor};
    border-radius: 10px;
    padding: 8px 10px;

    line-height: 1.2;
  }

  @media (max-width: 355px) {
    width: 315px;
  }

  .emptyCells {
    width: 100%;
    gap: 10px;
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    min-height: 100px;
    gap: 10px;
  }

  .col {
    width: 100%;
    background: ${(props) => props.theme.inputBgColor};

    border-radius: 5px;
    border: 1px solid ${(props) => props.theme.calenderBorder};
  }
`;
