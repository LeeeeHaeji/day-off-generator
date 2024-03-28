import React, { useState } from "react";
import styled from "styled-components";

import { GlobalStyle } from "./Styles/GlobalStyle";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./Styles/theme";
import { EmployeeData } from "./type";

import Calender from "./Components/Calender";
import Header from "./Components/Header";
import InputData from "./Components/InputData";
import AddDayOff from "./Components/AddDayOff";
import KakaoAdFit from "./Components/KakaoAdFit";

function App() {
  const [isDark, setIsDark] = useState(false);

  const [currentDate, setCurrentDate] = useState("");
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [dayOffNum, setDayOffNum] = useState("");
  const [dayOffMax, setDayOffMax] = useState("");

  const updateEmployees = (
    updateFunction: (prevEmployees: EmployeeData[]) => EmployeeData[]
  ) => {
    setEmployees(updateFunction);
  };

  const updateCurrentDate = (newDate: string) => {
    setCurrentDate(newDate);
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Header isDark={isDark} setIsDark={setIsDark} />

      <Main>
        <div className="main-item">
          <Wrap>
            <InputData
              currentDate={currentDate}
              updateCurrentDate={updateCurrentDate}
              employees={employees}
              updateEmployees={updateEmployees}
              dayOffNum={dayOffNum}
              setDayOffNum={setDayOffNum}
              dayOffMax={dayOffMax}
              setDayOffMax={setDayOffMax}
            />
            <Calender currentDate={currentDate} employees={employees} />
          </Wrap>
          <AddDayOff
            employees={employees}
            updateEmployees={updateEmployees}
            dayOffNum={dayOffNum}
            dayOffMax={dayOffMax}
          />
        </div>
        <KakaoAdFit />
      </Main>
    </ThemeProvider>
  );
}
export default App;

const Main = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px;

  .main-item {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 1023px) {
    flex-direction: row;
  }
`;
