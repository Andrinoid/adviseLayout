import React, { useRef } from "react";
import { Layout, Sider, Header, Content, Footer } from "./Layout";
import "allotment/dist/style.css";

const App = () => {
  const siderRef = useRef(null);

  return (
    <>
    <button onClick={() => {
        siderRef.current.toggle();
    }}>Collapse Sider</button>
    <Layout>
        <Sider ref={siderRef} ></Sider>
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
    </>
  );
};

export default App;
