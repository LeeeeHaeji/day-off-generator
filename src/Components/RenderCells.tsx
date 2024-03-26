import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { isSameMonth, addDays, format } from "date-fns";
import styled from "styled-components";
import { EmployeeData } from "../type";

interface RenderDaysProps {
  currentDate: string;
  employees: EmployeeData[];
}

export default function RenderCells({
  currentDate,
  employees,
}: RenderDaysProps) {
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

        let dayOffEmployees = employees
          .filter((employee) => {
            return employee.day_off.includes(formattedDate);
          })
          .map((employee, index) => (
            <NameWrapListItem
              key={`${employee.name}-${index}`}
              bg_color={employee.bg_color}
            >
              <p>{employee.name}</p>
            </NameWrapListItem>
          ));

        days.push(
          <div className={`col cell`} key={dayKey}>
            <p className="date">{formattedDate}</p>
            <NameList className="dayOffNames">{dayOffEmployees}</NameList>
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
    min-height: 100px;
    background: ${(props) => props.theme.inputBGColor};

    border: 1px solid #730202;
    border-radius: 5px;

    padding: 8px;

    display: flex;
    flex-direction: column;
    gap: 5px;

    p {
      padding-bottom: 1px;
    }
  }

  .date {
    font-size: 1.4rem;
    border-bottom: 1px solid #730202;
  }
`;

const NameList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;

  p {
    font-size: 1.3rem;
  }
`;

const NameWrapListItem = styled.li<{ bg_color: string }>`
  width: fit-content;
  display: flex;
  align-items: center;
  border-radius: 50px;

  padding: 2px 10px;

  background-color: ${(props) => props.bg_color};

  p {
    margin-top: 3px;
    line-height: 1.2;
  }

  button {
    padding: 0;
    background: transparent;
  }

  @media (max-width: 542px) {
    padding: 0px;
  }
`;
