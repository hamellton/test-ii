import React, { PropsWithChildren } from "react";
import Footer from "./Footer";
import { Box } from "@mui/material";
import Navbar from "./Navbar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", minHeight: "100vh", margin: "0 !important" }}>
      <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignContent: "flex-start", gap: "0" }}>
        <Navbar />
        <main style={{ flexGrow: 1, display: "flex", flexDirection: "column", maxWidth: "100%" }}>
          {children}
        </main>
      </Box>
      <Footer />
    </Box>
  );
};
export default Layout;