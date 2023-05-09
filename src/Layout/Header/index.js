import React from "react";
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

const Header = ({ siderRef, hasSidebarLinks, children }) => {
    const controls = useControls();
    console.log('test', hasSidebarLinks)
    const toggleSidebar = () => {
        if (siderRef.current) {
            siderRef.current.toggle();

            controls.popStacks();

        }
    };

    return (
        <HeaderContainer hasSidebarLinks={hasSidebarLinks}>
            {controls.getSidebars().filter((s) => !s.drawer).length > 0 && (
                <MenuButton onClick={toggleSidebar}>
                    <MenuIcon />
                </MenuButton>
            )}
            {children}
        </HeaderContainer>
    );
};

export default Header;
