import React from "react";
import { Layout, Sider, Header, Content, Footer } from "./Layout";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

const App = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <>
    <button onClick={() => {
      setOpen(!open);
    }}>Collapse Sider</button>
    <Layout>
      <Sider open={open}></Sider>
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
