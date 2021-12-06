import React from "react";
import styled from "@emotion/styled/macro";

import FormComponent from "./FormComponent";

const AppContainer = styled("main")`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const App = () => {
  return (
    <AppContainer>
      <FormComponent />
    </AppContainer>
  );
};

export default App;
