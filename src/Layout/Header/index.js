import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import MenuIcon from '../icons/MenuIcon';
import { Context } from '../index';

const HeaderContainer = styled.header`
  height: 60px;
  background-color: lightblue;
  flex: 0 0 auto;
  user-select: none;
`;

const MenuButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 100%;
    cursor: pointer;
    background-color: #f6f6f6;
    font-size: 19px;
`;

const Header = ({ siderRef, children }) => {

    const { isSidebarOpen } = useContext(Context);

    const toggleSidebar = () => {
        if (siderRef.current) {
            siderRef.current.toggle();
        }
    };


    return (
        <HeaderContainer>
            <MenuButton onClick={toggleSidebar}>
                <MenuIcon />
            </MenuButton>
            {children}
        </HeaderContainer>
    );
};

export default Header;