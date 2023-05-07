import React, { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { ResizableContainer } from "./ResizableContainer";
import Header from "./Header";
import LayoutContextProvider from "./LayoutContextProvider";
import { useControls } from "./SidebarsContextProvider";
import Drawer from "./Drawer";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Transition = styled.div`
    animation: ${(props) =>
        props.fadeIn
            ? css`
                  ${fadeIn} 0.25s ease-in forwards
              `
            : props.fadeOut
            ? css`
                  ${fadeOut} 0.25s ease-out forwards
              `
            : "none"};
`;

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

const footerHeight = 38;

const Content = styled.main`
    display: block;
    flex: 1 1 auto;
    user-select: none;
    overflow-y: scroll;
    padding-bottom: ${footerHeight}px;
`;

const Footer = styled.footer`
    height: ${footerHeight}px;
    background-color: #f8fafb;
    box-shadow: inset 0px 1px 0px #e8eaed;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
`;

const SiderContainer = styled.div`
    position: relative;
    display: flex;
`;

const Sider = React.forwardRef(
    ({ width, className, maxWidth = 600, minWidth = 200, children }, ref) => {
        const controls = useControls();

        return (
            <SiderContainer>
                {controls.getSidebars().map((sidebar, index) => {
                    if (sidebar.drawer) {
                        return (
                            // <Transition fadeIn={sidebar.data.length > 0}>
                                <Drawer
                                    key={index}
                                    index={index}
                                    drawer={sidebar.drawer}
                                    initialWidth={width}
                                    minWidth={minWidth}
                                    maxWidth={maxWidth}
                                    ref={ref}
                                    className={className}
                                >
                                    {sidebar.top() || children}
                                </Drawer>
                            // </Transition>
                        );
                    } else {
                        return (
                            <ResizableContainer
                                key={index}
                                initialWidth={width}
                                minWidth={minWidth}
                                maxWidth={maxWidth}
                                ref={ref}
                                className={className}
                            >
                                {sidebar.top() || children}
                            </ResizableContainer>
                        );
                    }
                })}
            </SiderContainer>
        );
    }
);

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
