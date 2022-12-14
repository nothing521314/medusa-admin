import { navigate } from "gatsby";
import React, { useEffect } from "react";
import SEO from "../components/seo";
import Layout from "../components/templates/layout";

const IndexPage = () => {
  useEffect(() => {
    navigate("/a/quotations");
  }, []);

  return (
    <Layout>
      <SEO title="Home" />
      <div>Loading...</div>
    </Layout>
  );
};

export default IndexPage;
