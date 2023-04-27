import React, { useRef } from "react";
import { Layout, Sider, Header, Content, Footer } from "./Layout";
import styled from "styled-components";

const LogoBox = styled.div`
  display: flex;
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
`;

const SiderMain = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
`;

const SiderFooter = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
`;

const App = () => {
  const logoSrc = process.env.PUBLIC_URL + '/logo.svg';
  const siderRef = useRef(null);

  return (
    <Layout>
      <StyledSider ref={siderRef} width={260}>
        <LogoBox>
          <img src={logoSrc} alt="Logo" style={{ width: '100%', height: 'auto', maxWidth: 160 }} />
        </LogoBox>
        <SiderContext>
          <SiderTop>Company </SiderTop>
          <SiderMain>some list</SiderMain>
          <SiderFooter>footer</SiderFooter>
        </SiderContext>
      </StyledSider>
      <Layout>
        <Header siderRef={siderRef}>

        </Header>
        <Content>Content</Content>
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

export default App;
