import React from "react";
import { SidebarContentProvider } from "./Layout/SiderContextProvider";
import Example from "./Example";

const App = () => {
  return (
    <SidebarContentProvider>
      <Example />
    </SidebarContentProvider>
  );
};

export default App;
