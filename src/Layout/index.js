import React from "react";
import styled, { css } from "styled-components";
import ResizableContainer from "./ResizableContainer";

const LayoutContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex 1;
  ${({ isParent }) => {
    if (isParent) {
      return `
      flex-direction: row;
      `;
    }
  }}
`;

const Header = styled.header`
  height: 60px;
  background-color: lightblue;
  flex: 0 0 auto;
`;

const Content = styled.main`
  display: block;
  flex: 1 1 auto;
`;

const Footer = styled.footer`
  height: 60px;
  background-color: lightgreen;
`;

const Sider = ({ children }) => {
  return (
    <ResizableContainer
      initialWidth={320}
      minWidth={200}
      maxWidth={600}
    >
      {children}
    </ResizableContainer>
  );
};



const Layout = ({ children }) => {
  let isParent = false;
  // Check if Layout is Layout parent
  React.Children.forEach(children, (child) => {
    if (child.type.name === "Layout") {
      isParent = true;
    }
  });
  return <LayoutContainer isParent={isParent}>{children}</LayoutContainer>;
};

export { Layout, Sider, Header, Content, Footer };