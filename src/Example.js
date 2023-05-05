import React, { useRef, useContext, useState } from "react";
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

const ControlButton = styled.button`
    border: none;
    background-color: ${({ inverted }) =>
        inverted ? "rgb(66, 82, 110)" : "rgb(248, 250, 251)"};
    color: ${({ inverted }) =>
        !inverted ? "rgb(66, 82, 110)" : "rgb(248, 250, 251)"};
    font-size: 15px;
    padding: 0 20px;
    height: 60px;
    cursor: pointer;
    font-weight: bold;
`;

const Flex = styled.div`
    display: flex;
    justify-content: ${(props) => props.justifyContent};
    align-items: ${(props) => props.alignItems};
    flex-direction: ${(props) => props.flexDirection};
    min-height: ${(props) => props.height}px;
    max-width: ${(props) => props.maxWidth}px;
    border: ${(props) => props.dashed && "2px dashed rgb(66, 82, 110)"};
    width: ${(props) => props.width}px;
    padding: ${(props) => props.padding}px;
`;

Flex.defaultProps = {
    justifyContent: "initial",
    alignItems: "initial",
    flexDirection: "initial",
    minHeight: 100,
    width: "100%",
    maxWidth: "100%",
    border: "initial",
    width: "100%",
    padding: "0 20px",
};

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

const DatasourcesSettings = () => {
    return (
        <SiderContext>
            <SiderTop>
                <b>Datasources</b>
            </SiderTop>
            <SiderMain>
                <ListItem>Datasource 1</ListItem>
                <ListItem>Datasource 2</ListItem>
                <ListItem>Datasource 3</ListItem>
            </SiderMain>
        </SiderContext>
    );
};

//TODO if the sider is not rendered the header sidebar icon should not be rendered
//create a custom hook that has access to the context

const Example = () => {
    const siderRef = useRef(null);
    const [sidebarNumber, setSidebarNumber] = useState(1);
    const controls = useControls();

    const changeSidebar = (number) => {
        if (number) {
            if (controls.getSidebar(number).length() % 2 == 0) {
                controls.changeSidebar(<SidabarControls />, number);
            } else {
                controls.changeSidebar(<DatasourcesSettings />, number);
            }
        }
    };

    const showCompanySettings = (sidebarNumber) => {
        controls.changeSidebar(<CompanySettings />, sidebarNumber);
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
                <ListItem onClick={() => changeSidebar(sidebarNumber)}>
                    <img src={process.env.PUBLIC_URL + "/home.svg"} />
                </ListItem>
                <ListItem onClick={() => showCompanySettings(sidebarNumber)}>
                    <img src={process.env.PUBLIC_URL + "/gear.svg"} />
                </ListItem>
            </SidebarLinks>

            <StyledSider
                ref={siderRef}
                width={260}
            >
                <SiderContext>
                   
                        <SiderTop>
                            <b>Company Name</b>
                        </SiderTop>
                    <SiderMain>
                        <ListItem>Default children case content null</ListItem>
                    </SiderMain>
                    <SiderFooter>footer</SiderFooter>
                </SiderContext>
            </StyledSider>

            <Layout>
                <Header siderRef={siderRef}></Header>
                <Content>
                    {/* just for demostation */}
                    <MainArea>
                        <Flex
                            flexDirection="column"
                            minHeight={100}
                            justifyContent="space-between"
                            alignItems="center"
                            dashed
                            padding={20}
                            width={400}
                        >
                            <input
                                type="number"
                                onChange={(e) => {
                                    if (e.target.value == "") {
                                        setSidebarNumber(1);
                                        return;
                                    }

                                    if (
                                        e.target.value >=
                                        controls.getSidebars().length
                                    ) {
                                        setSidebarNumber(
                                            controls.getSidebars().length
                                        );
                                        return;
                                    }

                                    if (e.target.value < 1) {
                                        setSidebarNumber(1);
                                        return;
                                    }

                                    setSidebarNumber(e.target.value);
                                }}
                                value={sidebarNumber}
                                style={{
                                    width: 350,
                                    minHeight: 40,
                                    fontSize: 20,
                                    textAlign: "center",
                                    border: "2px solid rgb(66, 82, 110)",
                                    borderRadius: 5,
                                    outline: "none",
                                    marginBottom: 10,
                                }}
                            />
                            <Flex
                                justifyContent="space-between"
                                style={{
                                    width: 350,
                                    marginBottom: 20,
                                }}
                            >
                                <ControlButton
                                    inverted
                                    onClick={() => changeSidebar(sidebarNumber)}
                                >
                                    Push on sidebar {sidebarNumber}
                                </ControlButton>
                                <ControlButton
                                    inverted
                                    onClick={() => {
                                        controls.popSidebar(sidebarNumber);
                                    }}
                                >
                                    Pop on sidebar {sidebarNumber}
                                </ControlButton>
                            </Flex>

                            <span
                                style={{
                                    textTransform: "uppercase",
                                    fontWeight: "bold",
                                    color: "rgb(66, 82, 110)",
                                }}
                            >
                                sidebar {sidebarNumber} stack size{" "}
                                {controls.getSidebar(sidebarNumber).length()}
                            </span>
                        </Flex>

                        <Flex
                            dashed
                            padding={20}
                            width={400}
                            style={{ marginTop: 10 }}
                        >
                            <ControlButton
                                inverted
                                onClick={() => {
                                    controls.addSidebar(<CompanySettings />);
                                }}
                            >
                                Add sidebar
                            </ControlButton>
                        </Flex>
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
