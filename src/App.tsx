import React from "react";
import { GlobalStyle } from "./Styles/GlobalStyle";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./Styles/theme";
import { useState } from "react";

function App() {
  const [isDark, setIsDark] = useState(false);

  const handleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <p>hello world</p>
      <button type="button" onClick={handleDarkMode}>
        클릭!
      </button>
    </ThemeProvider>
  );
}
export default App;
