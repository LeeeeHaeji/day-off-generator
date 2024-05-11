import React, { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { GlobalStyle } from "./Styles/GlobalStyle";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./Styles/theme";
import { EmployeeData } from "./type";
import { inputDataAtom } from "./Recoil/inputDataAtom";

import Calender from "./Components/Calender";
import Header from "./Components/Header";
import InputData from "./Components/InputData";
import AddDayOff from "./Components/AddDayOff";
import KakaoAdFit from "./Components/KakaoAdFit";

function App() {
  const [isDark, setIsDark] = useState(false);
  const [inputData, setInputData] = useRecoilState(inputDataAtom);

  const { employees } = inputData;

  const updateCurrentDate = (newDate: string) => {
    setInputData({ ...inputData, currentDate: newDate });
  };

  const updateEmployees = (
    updateFunction: (prevEmployees: EmployeeData[]) => EmployeeData[]
  ) => {
    setInputData({ ...inputData, employees: updateFunction(employees) });
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Header isDark={isDark} setIsDark={setIsDark} />

      <Main>
        <div className="main-item">
          <Wrap>
            <InputData
              updateCurrentDate={updateCurrentDate}
              updateEmployees={updateEmployees}
            />
            <Calender />
          </Wrap>
          <AddDayOff updateEmployees={updateEmployees} />
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
