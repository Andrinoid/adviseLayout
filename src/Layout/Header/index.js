import React, { useCallback } from "react";
import styled from "styled-components";
import MenuIcon from "../icons/MenuIcon";
import { useControls } from "../SidebarsContextProvider";

const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    height: 60px;
    background-color: #f8fafb;
    flex: 0 0 auto;
    user-select: none;
    position: fixed;
    width: 100%;

    transition: padding-left 0.2s ease;
`;

const MenuButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 100%;
    cursor: pointer;
    // background-color: #f6f6f6;
    font-size: 19px;
    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
    &:active {
        background-color: rgba(0, 0, 0, 0.08);
    }
`;

const Header = ({ siderRef, height, hasSidebarLinks, children, ...rest }) => {
    const controls = useControls();

    const toggleSidebar = useCallback(() => {
        controls.setCollapsing(controls.data.collapsing.isCollapsed, true);

        if (siderRef.current) {
            siderRef.current.toggle();
            controls.popStacks("drawer");
        }
    }, [controls, siderRef]);

    const amount = controls.getSidebars().filter((s) => s.drawer).length;

    return (
        <HeaderContainer style={{ height: height }} {...rest} hasSidebarLinks={hasSidebarLinks}>
            {controls.getSidebars().filter((s) => !s.drawer).length > 0 && (
                <MenuButton
                    onClick={toggleSidebar}
                    style={{ paddingLeft: 260 * amount }}
                >
                    <MenuIcon />
                </MenuButton>
            )}
            {children}
        </HeaderContainer>
    );
};

export default Header;
