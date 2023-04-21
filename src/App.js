import React from "react";
import { Layout, Sider, Header, Content, Footer } from "./Layout";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

const App = () => {


  return (
    <Layout>
      <Sider></Sider>
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
