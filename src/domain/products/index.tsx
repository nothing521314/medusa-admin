import { Router } from "@reach/router";
import React from "react";
import Edit from "./edit";
import New from "./new";
import Overview from "./overview";

const ProductsRoute = () => {
  return (
    <Router>
      <Overview path="/" />
      <New path="/create" />
      <Edit path="/:id" />
    </Router>
  );
};

export default ProductsRoute;
