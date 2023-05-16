import React, { useRef, useContext, useState, useEffect } from "react";
import {
    Layout,
    Sider,
    Header,
    Content,
    Footer,
    SidebarLinks,
    SideBarPanel,
} from "./Layout";
import styled from "styled-components";
import { useControls } from "./Layout/SidebarsContextProvider";
import Transition from "./Layout/Transition";

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
    border-right: ${({ right }) => !right && "1px solid rgb(232, 232, 232)"};
    border-left: ${({ right }) => right && "1px solid rgb(232, 232, 232)"};
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
    width: 100%;
    max-width: 125px;
    margin-bottom: 10px;
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
    flex-wrap: wrap;
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

const CloseBtn = styled.div`
    border: none;
    outline: 0px;
    user-select: none;
    margin-left: auto;
    padding: 0px;
    font-family: inherit;
    font-size: 11px;
    position: relative;
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
    const controls = useControls();
    return (
        <SiderContext>
            <SiderTop>
                <b>Company Name</b>
                {/* <CloseBtn onClick={() => controls.popSidebar(1)}><img src={process.env.PUBLIC_URL + "/cross.svg"} /></CloseBtn> */}
            </SiderTop>
            <SiderMain>
                <ListItem
                    onClick={(e) => {
                        console.log("clicked");
                        e.preventDefault();

                        controls.addSidebar({
                            component: <CompanySettings />,
                            drawer: false,
                        });
                    }}
                    onTouchEnd={(e) => {
                        e.preventDefault();

                        controls.addSidebar({
                            component: <CompanySettings />,
                            drawer: false,
                        });
                    }}
                >
                    Company Profile
                </ListItem>
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
    const [width, setWidth] = useState(null);
    const controls = useControls();

    const changeSidebar = (number) => {
        if (number) {
            const sidebar = controls.getSidebar(number);
            if (sidebar && sidebar.length() % 2 == 0) {
                controls.addToSidebar(<SidabarControls />, number);
            } else {
                controls.addToSidebar(<DatasourcesSettings />, number);
            }
        }
    };

    return (
        <Layout>
            <SideBarPanel>
                <SidebarLinks>
                    {/* app code */}
                    <SiderTop padding={12}>
                        <img
                            src={process.env.PUBLIC_URL + "/advise.png"}
                            alt="Logo"
                            style={{
                                width: "100%",
                                height: "auto",
                                maxWidth: 60,
                            }}
                        />
                    </SiderTop>
                    <ListItem
                        onClick={() => {
                            controls.addToSidebar(
                                <DatasourcesSettings />,
                                sidebarNumber
                            );
                        }}
                    >
                        <img src={process.env.PUBLIC_URL + "/home.svg"} />
                    </ListItem>
                    <ListItem
                        onClick={() => {
                            controls.addToSidebar(
                                <CompanySettings />,
                                sidebarNumber
                            );
                        }}
                    >
                        <img src={process.env.PUBLIC_URL + "/gear.svg"} />
                    </ListItem>
                    {/* app code */}
                </SidebarLinks>

                <StyledSider ref={siderRef} width={260}>
                    {/* app code */}
                    <SiderContext>
                        <SiderTop>
                            <b>Company Name</b>
                        </SiderTop>
                        <SiderMain>
                            <ListItem>
                                Default children case content null
                            </ListItem>
                        </SiderMain>
                        <SiderFooter>footer</SiderFooter>
                    </SiderContext>
                    {/* app code */}
                </StyledSider>
            </SideBarPanel>

            <Layout>
                <Header siderRef={siderRef}></Header>
                <Content>
                    {/* app code */}
                    <MainArea>
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            flexDirection="column"
                        >
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
                                            e.target.value >= controls.length()
                                        ) {
                                            setSidebarNumber(controls.length());
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
                                    justifyContent="space-around"
                                    style={{
                                        width: 350,
                                        marginBottom: 20,
                                    }}
                                >
                                    <ControlButton
                                        inverted
                                        onClick={() =>
                                            changeSidebar(sidebarNumber)
                                        }
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
                                    {controls.getSidebar(sidebarNumber) &&
                                        controls
                                            .getSidebar(sidebarNumber)
                                            .length()}
                                </span>
                            </Flex>

                            <Flex
                                dashed
                                padding={20}
                                width={400}
                                style={{ marginTop: 10 }}
                                justifyContent="space-between"
                            >
                                <ControlButton
                                    inverted
                                    onClick={() => {
                                        controls.addSidebar({
                                            component: <CompanySettings />,
                                            drawer: false,
                                            width: +width,
                                        });

                                        setSidebarNumber(controls.length());
                                    }}
                                >
                                    Add sidebar
                                </ControlButton>

                                <ControlButton
                                    inverted
                                    onClick={() => {
                                        controls.addSidebar(
                                            <CompanySettings />,
                                            { drawer: true }
                                        );

                                        setSidebarNumber(controls.length());
                                    }}
                                >
                                    Add drawer
                                </ControlButton>

                                <ControlButton
                                    inverted
                                    onClick={() => {
                                        controls.popStack();
                                        setSidebarNumber(controls.length());
                                    }}
                                >
                                    Pop
                                </ControlButton>

                                <ControlButton
                                    inverted
                                    onClick={() => {
                                        controls.popStacks();
                                        setSidebarNumber(controls.length());
                                    }}
                                >
                                    Pop all
                                </ControlButton>
                            </Flex>

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
                                    value={width == null ? "" : width}
                                    placeholder="Sidebar Width"
                                    type="number"
                                    onChange={(e) => {
                                        // if (e.target.value == "") {
                                        //     setSidebarNumber(1);
                                        //     return;
                                        // }
                                        if (e.target.value) {
                                            setWidth(e.target.value);
                                            return;
                                        }

                                        if (e.target.value == "") {
                                            setWidth(null);
                                            return;
                                        }
                                        // if (
                                        //     e.target.value >= controls.length()
                                        // ) {
                                        //     setSidebarNumber(controls.length());
                                        //     return;
                                        // }

                                        // if (e.target.value < 1) {
                                        //     setSidebarNumber(1);
                                        //     return;
                                        // }

                                        // setSidebarNumber(e.target.value);
                                    }}
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
                            </Flex>
                        </Flex>
                    </MainArea>
                    {/* app code */}
                </Content>
                <Footer>
                    {/* app code */}
                    <Tabs>
                        <Tab>Actual</Tab>
                        <Tab>Budget</Tab>
                        <Tab>Comparison</Tab>
                        <Tab>Dashboard</Tab>
                    </Tabs>
                    {/* app code */}
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Example;
