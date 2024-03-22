import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { isSameMonth, addDays, format } from "date-fns";
import styled from "styled-components";

interface RenderDaysProps {
  currentDate: string;
}

export default function RenderCells({ currentDate }: RenderDaysProps) {
  const monthStart = startOfMonth(new Date(currentDate));
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      if (isSameMonth(day, monthStart)) {
        formattedDate = format(day, "d");
        const dayKey = format(day, "yyyy-MM-dd");
        days.push(
          <div className={`col cell`} key={dayKey}>
            {formattedDate}
          </div>
        );
      } else {
        days.push(
          <div className={`col cell disabled`} key={format(day, "yyyy-MM-dd")}>
            {/* 현재 달과 다른 날짜는 출력하지 않음 */}
          </div>
        );
      }

      day = addDays(day, 1);
    }

    rows.push(
      <div className="row" key={day.toISOString()}>
        {days}
      </div>
    );
    days = [];
  }

  return <DayContainer>{rows}</DayContainer>;
}

const DayContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  .row {
    display: flex;
    gap: 10px;
  }

  .cell {
    width: 100%;
    height: 100px;
    background: orange;
    border: 1px solid red;
  }
`;
