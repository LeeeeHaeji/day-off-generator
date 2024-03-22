import styled from "styled-components";

export default function RenderDays() {
  const days = [];
  const date = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    days.push(<li key={i}>{date[i]}</li>);
  }

  return <DaysRow>{days}</DaysRow>;
}

const DaysRow = styled.div`
  display: flex;
  gap: 10px;

  li {
    width: 100%;
    text-align: center;
    background: orange;
  }
`;
