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
    ${({ hasSidebarLinks }) => {
        if (hasSidebarLinks) {
            return `
                padding-left: 60px;
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

const FooterContainer = styled.footer`
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

const SidebarLinksContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 60px;
    background-color: #242a43;
    border-right: 1px solid rgb(232, 232, 232);
    background: #f8fafb;
    flex-shrink: 0;
    position: fixed;
    left: 0;
    z-index: 1;
`;

const Footer = ({ children }) => {
    return <FooterContainer>{children}</FooterContainer>;
};

const SidebarLinks = ({ children }) => {
    return <SidebarLinksContainer>{children}</SidebarLinksContainer>;
};


const Sider = React.forwardRef(
    ({ width, className, maxWidth = 600, minWidth = 200, children }, ref) => {
        const controls = useControls();

        return (
            <SiderContainer>
                {controls
                    .getSidebars()
                    .filter((s) => !s.drawer)
                    .map((sidebar, index) => {
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
                    })}

                {controls
                    .getSidebars()
                    .filter((s) => s.drawer)
                    .map((sidebar, index) => {
                        return (
                            <Transition key={index} fadeIn={sidebar.data.length > 0}>
                                <Drawer
                                    
                                    index={index + 1}
                                    drawer={sidebar.drawer}
                                    initialWidth={width}
                                    minWidth={minWidth}
                                    maxWidth={maxWidth}
                                    ref={ref}
                                    className={className}
                                >
                                    {sidebar.top() || children}
                                </Drawer>
                            </Transition>
                        );
                    })}
            </SiderContainer>
        );
    }
);

const Layout = ({ children }) => {
    let isParent = false;
    let hasSidebarLinks = false;
    // Check if Layout is Layout parent
    React.Children.forEach(children, (child) => {
        if (child.type.name === "Layout") {
            isParent = true;
        }
        // Check if Layout has SidebarLinks
        if (child.type.name === "SidebarLinks") {
            hasSidebarLinks = true;
        }
    });

    const layoutContent = (
        <LayoutContainer hasSidebarLinks={hasSidebarLinks} isParent={isParent}>{children}</LayoutContainer>
    );

    //only render the LayoutContextProveder on the parent Layout
    return isParent ? (
        <LayoutContextProvider>{layoutContent}</LayoutContextProvider>
    ) : (
        layoutContent
    );
};

export { Layout, Sider, SidebarLinks, Header, Content, Footer };
