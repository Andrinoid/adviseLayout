import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import ResizableContainer from "./ResizableContainer";
import Header from "./Header";
import LayoutContextProvider from "./LayoutContextProvider";



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
  height: 38px;
  background-color: #f8fafb;
  box-shadow: inset 0px 1px 0px #e8eaed;
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

  const layoutContent = (
    <LayoutContainer isParent={isParent}>{children}</LayoutContainer>
  );

  //only render the LayoutContextProveder on the parent Layout
  return isParent ? (
    <LayoutContextProvider>{layoutContent}</LayoutContextProvider>
  ) : (
    layoutContent
  );
};


export { Layout, Sider, Header, Content, Footer };