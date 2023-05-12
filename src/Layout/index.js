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

const footerHeight = 38;
const sidebarLinksWidth = 60;
const headerHeight = 60;
const LayoutContainer = styled.section`
    display: flex;
    flex-direction: column;
    height: 100vh;
    flex: 1;
    box-sizing: border-box;
    padding-left: ${({ padding, right }) => (!right ? padding : "initial")}px;
    padding-right: ${({ padding, right }) => (right ? padding : "initial")}px;
    transition: padding-left 0.2s ease, padding-right 0.2s ease;
    ${({ isParent }) => {
        if (isParent) {
            return `
                flex-direction: row;
            `;
        }
    }}

    ${({ hasHeader }) => {
        if (hasHeader) {
            return `
                padding-top: ${headerHeight}px;
                `;
        }
    }}
    ${({ hasFooter }) => {
        if (hasFooter) {
            return `
                padding-bottom: ${footerHeight}px;
            `;
        }
    }}
`;

const LayoutContainerParent = styled.section`
    display: flex;
    flex-direction: flow;
    height: 100vh;
    flex: 1;
    box-sizing: border-box;
`;

const Content = styled.main`
    display: block;
    flex: 1 1 auto;
    user-select: none;
    /* overflow-y: scroll; */
    // padding-bottom: ${footerHeight}px;
    padding-left: ${({ paddingLeft }) => paddingLeft}px;
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
    height: 100%;
    background-color: aliceblue;

    @media (max-width: 450px) {
        overflow: scroll;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;

        &::-webkit-scrollbar {
            display: none;
        }

        width: ${({ width }) => width}px;
    }
`;

const SidebarLinksContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 60px;
    background-color: #242a43;
    border-right: ${({ right }) => (right ? "none" : "1px solid #e8eaed")};
    border-left: ${({ right }) => (right ? "1px solid #e8eaed" : "none")};
    background: #f8fafb;
    flex-shrink: 0;
    position: fixed;
    left: ${({ right }) => (right ? "initial" : 0)};
    right: ${({ right }) => (right ? 0 : "initial")};
    z-index: 1;
`;

const SideBarPanelContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    height: 100%;
    z-index: 1;
    padding-left: ${({ right }) => (right ? 0 : sidebarLinksWidth)}px;
    padding-right: ${({ right }) => (right ? sidebarLinksWidth : 0)}px;
    left: ${({ right }) => (right ? "initial" : 0)};
    right: ${({ right }) => (right ? 0 : "initial")};
`;

const SideBarPanel = ({ children, right }) => {
    if (right) {
        children = React.Children.map(children, (child) => {
            return React.cloneElement(child, { right: true });
        });
    }
    return (
        <SideBarPanelContainer right={right}>{children}</SideBarPanelContainer>
    );
};

const Footer = ({ children }) => {
    return <FooterContainer>{children}</FooterContainer>;
};

const SidebarLinks = ({ children, right }) => {
    return (
        <SidebarLinksContainer right={right}>{children}</SidebarLinksContainer>
    );
};

const SwipeContainer = styled.div`
    height: 100%;
    display: flex;
    /* position: relative; */

    @media (max-width: 450px) {
        overflow: scroll;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;

        &::-webkit-scrollbar {
            display: none;
        }

        width: ${({ width }) => width}px;
    }
`;

let lastScroll = 0;
const Sider = React.forwardRef(
    (
        { width, className, maxWidth = 600, minWidth = 200, right, children },
        ref
    ) => {
        const [actualWidth, setActualWidth] = useState(width);
        const controls = useControls();

        useEffect(() => {
            if (window.innerWidth <= 450) {
                setActualWidth(window.innerWidth - 60);
            }
        }, []);

        function handleSwipe() {
            const elementYs = Array.from(
                document.querySelectorAll(".swipe-element")
            ).map((e) => e.offsetLeft);

            const container = document.querySelector(".sider-container");

            const scroll = container.scrollLeft;

            let next;

            if (scroll > lastScroll) {
                next = nextDistance("desc");
            } else {
                next = nextDistance("asc");
            }

            container.scrollTo({
                left: next,
                behavior: "smooth",
            });

            lastScroll = scroll;

            function nextDistance(order) {
                if (order === "asc") {
                    return elementYs
                        .reverse()
                        .find((element) => element < scroll);
                }

                return elementYs.find((element) => element > scroll);
            }
        }

        const sidebars = controls.getSidebars().filter((s) => !s.drawer);

        return (
            <SwipeContainer
                className="swipe-container"
                width={actualWidth}
                onTouchEnd={handleSwipe}
            >
                <SiderContainer className="sider-container">
                    {sidebars.map((sidebar, index) => {
                        return (
                            <ResizableContainer
                                key={index}
                                initialWidth={actualWidth}
                                minWidth={minWidth}
                                maxWidth={maxWidth}
                                ref={ref}
                                className={className + " swipe-element"}
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
                                <Transition
                                    key={index}
                                    fadeIn={sidebar.data.length > 0}
                                >
                                    <Drawer
                                        index={index + 1}
                                        drawer={sidebar.drawer}
                                        initialWidth={actualWidth}
                                        minWidth={minWidth}
                                        maxWidth={maxWidth}
                                        ref={ref}
                                        right={right}
                                        className={className + " swipe-element"}
                                    >
                                        {sidebar.top() || children}
                                    </Drawer>
                                </Transition>
                            );
                        })}
                </SiderContainer>
            </SwipeContainer>
        );
    }
);

const Layout = ({ children, right }) => {
    const controls = useControls();

    const siders = controls.getSidebars().filter((s) => !s.drawer);

    let isParent = false;
    let hasSidebarLinks = false;
    let hasHeader = false;
    let hasFooter = false;

    // Check if Layout is Layout parent
    React.Children.forEach(children, (child) => {
        if (child.type.name === "Layout") {
            isParent = true;
        }
        // // Check if Layout has SidebarLinks
        // if (child.type.name === "SidebarLinks") {
        //     hasSidebarLinks = true;
        // }
        // Check if Layout has Header
        if (child.type.name === "Header") {
            hasHeader = true;
        }
        // Check if Layout has Footer
        if (child.type.name === "Footer") {
            hasFooter = true;
        }
    });

    children = React.Children.map(children, (child) => {
        if (
            child.type.name !== "Layout" &&
            child.type.name !== "SideBarPanel"
        ) {
            return child;
        }
        return React.cloneElement(child, { right: right });
    });

    const sidebarWidth = 260;
    const paddingLeft = 60 + siders.length * sidebarWidth;

    const header = controls.getHeader();

    const padding = header.shouldCollapse
        ? header.isCollapsed
            ? 60
            : paddingLeft
        : 0;

    console.log(padding)

    //only render the LayoutContextProveder on the parent Layout
    return isParent ? (
        <LayoutContextProvider>
            <LayoutContainerParent>{children}</LayoutContainerParent>
        </LayoutContextProvider>
    ) : (
        <LayoutContainer
            padding={padding}
            right={right}
            hasFooter={hasFooter}
            hasHeader={hasHeader}
            hasSidebarLinks={hasSidebarLinks}
            isParent={isParent}
        >
            {children}
        </LayoutContainer>
    );
};

export { Layout, Sider, SidebarLinks, Header, Content, Footer, SideBarPanel };
