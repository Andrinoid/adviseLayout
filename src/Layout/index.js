import React from "react";
import styled, { css } from "styled-components";
import ResizableContainer from "./ResizableContainer";
import Header from "./Header";

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