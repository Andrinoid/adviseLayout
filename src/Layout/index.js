import React, { useState } from "react";
import styled, { css } from "styled-components";
import ResizableContainer from "./ResizableContainer";
import Header from "./Header";


export const Context = React.createContext();

const LayoutContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex: 1;
  ${({ isParent }) => {
    if (isParent) {
      return `
      flex-direction: row;
      `;
    }
  }}
`;

const Content = styled.main`
  display: block;
  flex: 1 1 auto;
  user-select: none;
`;

const Footer = styled.footer`
  height: 60px;
  background-color: lightgreen;
`;

const Sider = React.forwardRef(({ width, className, maxWidth = 600, minWidth = 200, children }, ref) => {
  return (
    <ResizableContainer
      initialWidth={width}
      minWidth={minWidth}
      maxWidth={maxWidth}
      ref={ref}
      className={className}
    >
      {children}
    </ResizableContainer>
  );
});


const Layout = ({ children }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  let isParent = false;
  // Check if Layout is Layout parent
  React.Children.forEach(children, (child) => {
    if (child.type.name === "Layout") {
      isParent = true;
    }
  });
  return (
    <Context.Provider value={{
      isSidebarOpen,
      setIsSidebarOpen
    }}>
      <LayoutContainer isParent={isParent}>{children}</LayoutContainer>
    </Context.Provider>
  );
};

export { Layout, Sider, Header, Content, Footer };