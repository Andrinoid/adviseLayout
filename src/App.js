import React, { useRef } from "react";
import { Layout, Sider, Header, Content, Footer } from "./Layout";
import styled from "styled-components";

const LogoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 40px 10px 40px;
`;

const StyledSider = styled(Sider)`
  background-color: lightblue;
  border-right: 1px solid rgb(232, 232, 232);
  background: #f8fafb;
`;

const App = () => {
  const logoSrc = process.env.PUBLIC_URL + '/logo.svg';
  const siderRef = useRef(null);

  return (
    <Layout>
      <StyledSider ref={siderRef} width={260}>
        <LogoBox>
          <img src={logoSrc} alt="Logo" style={{ width: '100%', height: 'auto', maxWidth: 170 }} />
        </LogoBox>
      </StyledSider>
      <Layout>
        <Header siderRef={siderRef}>

        </Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
