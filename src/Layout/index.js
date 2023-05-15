import React, { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { ResizableContainer } from "./ResizableContainer";
import Header from "./Header";
import LayoutContextProvider from "./LayoutContextProvider";
import { useControls } from "./SidebarsContextProvider";
import Drawer from "./Drawer";
import Transition from "./Transition";

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

    ${({ width }) => {
        const isTouchDevice =
            "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
            return `
                overflow: scroll;
                overflow-x: scroll;
                scroll-snap-type: x mandatory;

                &::-webkit-scrollbar {
                    display: none;
                }

                width: ${width}px;
            `;
        }
        return "";
    }}
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

const SideBarPanel = ({ children }) => {
    const { getIsAtRight } = useControls();

    if (getIsAtRight()) {
        children = React.Children.map(children, (child) => {
            return React.cloneElement(child, { right: true });
        });
    }
    return (
        <SideBarPanelContainer right={getIsAtRight()}>
            {children}
        </SideBarPanelContainer>
    );
};

const Footer = ({ children }) => {
    return <FooterContainer>{children}</FooterContainer>;
};

const SidebarLinks = ({ children }) => {
    const { getIsAtRight } = useControls();
    return (
        <SidebarLinksContainer right={getIsAtRight()}>
            {children}
        </SidebarLinksContainer>
    );
};

const SwipeContainer = styled.div`
    height: 100%;
    display: flex;
    /* position: relative; */

    ${({ width, sidebarsAmount }) => {
        const isTouchDevice =
            "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
            let result = `
                overflow: scroll;
                overflow-x: scroll;
                scroll-snap-type: x mandatory;

                &::-webkit-scrollbar {
                    display: none;
                }
            `;

            if (sidebarsAmount > 0) {
                result += `
                    width: ${width}px;
                `;
            }

            return result;
        }
        return "";
    }}
`;

const CloseBtn = styled.div`
    border: none;
    outline: 0px;
    user-select: none;
    margin-left: auto;
    padding: 0px;
    font-family: inherit;
    font-size: 11px;
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    border-radius: 2px;
    color: rgb(171, 171, 171);
    box-sizing: border-box;
    box-shadow: none;
    align-self: center;
    width: 24px;
    cursor: pointer;
    background: transparent;
    &:hover {
        background: rgba(0, 0, 0, 0.04);
    }
    z-index: 1;
`;

let lastScroll = 0;
const Sider = React.forwardRef(
    (
        { width, className, maxWidth = 600, minWidth = 200, children },
        ref
    ) => {
        const [actualWidth, setActualWidth] = useState(width);
        const controls = useControls();

        useEffect(() => {
            const isTouchDevice =
                "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;
            console.log(isTouchDevice);
            if (isTouchDevice) {
                setActualWidth(window.innerWidth - 60);
            }
        }, []);

        function handleSwipe() {
            const elementYs = Array.from(
                document.querySelectorAll(".swipe-element")
            ).map((e) => {
                return e.offsetLeft;
            });

            const container = document.querySelector(".swipe-container");

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

            lastScroll = next;

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
            <SiderContainer className="sider-container">
                <SwipeContainer
                    className="swipe-container"
                    width={actualWidth}
                    onTouchEnd={handleSwipe}
                    sidebarsAmount={controls.getSidebars().length}
                >
                    {sidebars.map((sidebar, index) => {
                        return (
                            <div
                                style={{ position: "relative" }}
                                className="swipe-element"
                            >
                                <CloseBtn
                                    onClick={() =>
                                        controls.popStackFrom(sidebar)
                                    }
                                >
                                    <img
                                        src={
                                            process.env.PUBLIC_URL +
                                            "/cross.svg"
                                        }
                                    />
                                </CloseBtn>
                                <ResizableContainer
                                    key={index}
                                    initialWidth={actualWidth}
                                    minWidth={minWidth}
                                    maxWidth={maxWidth}
                                    ref={ref}
                                    className={className}
                                >
                                    {sidebar.top() || children}
                                </ResizableContainer>
                            </div>
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
                                        right={controls.getIsAtRight()}
                                        className={className + " swipe-element"}
                                        closeButton={
                                            <CloseBtn
                                                onClick={() =>
                                                    controls.popStackFrom(
                                                        sidebar
                                                    )
                                                }
                                            >
                                                <img
                                                    src={
                                                        process.env.PUBLIC_URL +
                                                        "/cross.svg"
                                                    }
                                                />
                                            </CloseBtn>
                                        }
                                    >
                                        {sidebar.top() || children}
                                    </Drawer>
                                </Transition>
                            );
                        })}
                </SwipeContainer>
            </SiderContainer>
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

    //only render the LayoutContextProveder on the parent Layout
    return isParent ? (
        <LayoutContextProvider>
            <LayoutContainerParent>{children}</LayoutContainerParent>
        </LayoutContextProvider>
    ) : (
        <LayoutContainer
            padding={padding}
            right={controls.getIsAtRight()}
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
