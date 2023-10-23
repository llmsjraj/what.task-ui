import React, { useEffect, useState } from "react";
import { getUser } from "../hooks/user.actions";
import Navigationbar from "../components/Navbar";
import { ProductTable } from "../components/product";

const Home = () => {
  const user = getUser();

  if (!user) {
    return <div>Loading!</div>;
  }

  return (
    <>
      <Navigationbar username={user.username} />
      <ProductTable />
    </>
  );
};
export default Home;
