import React, { useRef, useContext } from "react";
import { Layout, Sider, Header, Content, Footer } from "./Layout";
import styled from "styled-components";
import { useControls } from "./Layout/SidebarsContextProvider";

const LogoBox = styled.div`
    display: flex;
    background: #f8fafb;
    box-sizing: border-box;
    padding: 10px;
    justify-content: center;
    align-items: center;
    height: 60px; //use headerHeight variable here and on the header to make sure this is always in alignment
`;

const StyledSider = styled(Sider)`
    background-color: lightblue;
    border-right: 1px solid rgb(232, 232, 232);
    background: #f8fafb;
`;

const Tabs = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
`;

const Tab = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 20px;
    cursor: pointer;
    font-size: 15px;
    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
    &:active {
        background-color: rgba(0, 0, 0, 0.08);
    }
`;

const SiderContext = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100% - 60px); //use the header height variable here
`;

const SiderTop = styled.div`
    box-sizing: border-box;
    border-bottom: 1px solid rgb(232, 232, 232); // put into a variable
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 ${(props) => props.padding}px;
    font-size: 15px;
    cursor: pointer;

    & > img {
        width: 100%;
        height: auto;
        max-width: 60px;
    }
`;

SiderTop.defaultProps = {
    padding: 20, // Set default padding value to 20
};

const SiderMain = styled.div`
    flex: 1 1 auto;
    overflow-y: auto;
`;

const SiderFooter = styled.div`
    display: flex;
    align-items: center;
    height: 60px;
`;

const MainArea = styled.div`
    padding: 20px;
`;

const ListItem = styled.div`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 20px;
    font-size: 15px;
    cursor: pointer;
    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
    &:active {
        background-color: rgba(0, 0, 0, 0.08);
    }

    & > img {
        width: 100%;
        height: auto;
        max-width: 60px;
    }
`;

const SidebarLinks = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 60px;
    background-color: #242a43;
    border-right: 1px solid rgb(232, 232, 232);
    background: #f8fafb;
`;

const SidabarControls = () => {
    return (
        <>
            <SiderTop padding={10}>
                <b>Controls</b>
            </SiderTop>
            <MainArea>
                <p>Some range</p>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value="50"
                    onChange={() => {}}
                ></input>
            </MainArea>
        </>
    );
};

const CompanySettings = () => {
    return (
        <SiderContext>
            <SiderTop>
                <b>Company Name</b>
            </SiderTop>
            <SiderMain>
                <ListItem>Company Profile</ListItem>
                <ListItem>Users & Permissions</ListItem>
                <ListItem>Invitation Center</ListItem>
            </SiderMain>
        </SiderContext>
    );
};

//TODO if the sider is not rendered the header sidebar icon should not be rendered
//create a custom hook that has access to the context

const Example = () => {
    const siderRef = useRef(null);
    const controls = useControls();

    const changeSidebar = () => {
        if (controls.getSidebar(1) === null) {
            controls.setSidebar(<SidabarControls />);
        } else {
            controls.clearContent();
        }
    };

    const showCompanySettings = () => {
        controls.setSidebar(<CompanySettings />);
    };

    return (
        <Layout>
            <SidebarLinks>
                <SiderTop padding={12}>
                    <img
                        src={process.env.PUBLIC_URL + "/advise.png"}
                        alt="Logo"
                        style={{ width: "100%", height: "auto", maxWidth: 60 }}
                    />
                </SiderTop>
                <ListItem onClick={changeSidebar}>
                    <img src={process.env.PUBLIC_URL + "/home.svg"} />
                </ListItem>
                <ListItem onClick={showCompanySettings}>
                    <img src={process.env.PUBLIC_URL + "/gear.svg"} />
                </ListItem>
            </SidebarLinks>

            {controls.getSidebars().map((sidebar, i) => {
                return (
                    <StyledSider
                        drawer={i != 0}
                        content={sidebar.content}
                        ref={siderRef}
                        width={260}
                    >
                        <SiderContext>
                            {i == 0 && (
                                <SiderTop>
                                    <b>Company Name {i + 1}</b>
                                </SiderTop>
                            )}
                            <SiderMain>
                                <ListItem>Some stuff</ListItem>
                            </SiderMain>
                            <SiderFooter>footer</SiderFooter>
                        </SiderContext>
                    </StyledSider>
                );
            })}

            <Layout>
                <Header siderRef={siderRef}></Header>
                <Content>
                    {/* just for demostation */}
                    <MainArea>
                        <button onClick={changeSidebar}>Change sidebars</button>
                    </MainArea>
                    {/* just for demostation */}
                </Content>
                <Footer>
                    {/* just for demostation */}
                    <Tabs>
                        <Tab>Actual</Tab>
                        <Tab>Budget</Tab>
                        <Tab>Comparison</Tab>
                        <Tab>Dashboard</Tab>
                    </Tabs>
                    {/* just for demostation */}
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Example;
