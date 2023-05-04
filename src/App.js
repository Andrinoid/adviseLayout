import React from "react";
import { SidebarsProvider } from "./Layout/SidebarsContextProvider";
import Example from "./Example";

const App = () => {
  return (
    <SidebarsProvider>
      <Example />
    </SidebarsProvider>
  );
};

export default App;
