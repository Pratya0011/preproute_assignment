import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar, {
  EXPANDED_WIDTH,
  COLLAPSED_WIDTH,
  LOGO_HEIGHT,
} from "./Components/Sidebar/Sidebar";
import Header from "./Components/Header/Header";

function Layout(props: any) {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar open={open} onToggle={() => setOpen((prev) => !prev)} />
      <Header sidebarOpen={open} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${open ? EXPANDED_WIDTH : COLLAPSED_WIDTH}px`,
          mt: `${LOGO_HEIGHT}px`,
          transition: "margin-left 0.25s ease",
          minHeight: `calc(100vh - ${LOGO_HEIGHT}px)`,
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default Layout;
