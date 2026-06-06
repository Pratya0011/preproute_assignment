import { Box } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Header from "./Components/Header/Header";
import Sidebar, {
  COLLAPSED_WIDTH,
  EXPANDED_WIDTH,
  LOGO_HEIGHT,
} from "./Components/Sidebar/Sidebar";
import useUserRolePermissions from "./Components/userRolePermission";
import { useMatch } from "react-router-dom";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";

function Layout(props: any) {
  const sidebarToggle = useSelector((state: any) => state?.common?.sidebarOpen);
  const menuObj: any = useUserRolePermissions();
  const match = useMatch(location.pathname)!;
  const loggedInUserDetails = useSelector(
    (state: any) => state.common.loggedInUserDetails,
  );

  const isRouteHasAccess = useMemo(() => {
    const allMenus: any = [...menuObj.combinedMenu];
    const foundMenu = allMenus.find((ele: any) => ele.to === match.pathname);

    if (!foundMenu || !foundMenu.roles.length) {
      return false;
    }
    const userRole = loggedInUserDetails?.role?.toLowerCase() ?? "";
    const isAccess = foundMenu.roles.filter(
      (ele: any) => userRole === ele.toLowerCase(),
    );
    return isAccess.length > 0;
  }, [match.pathname, loggedInUserDetails?.role, menuObj.combinedMenu]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar open={sidebarToggle} />
      <Header sidebarOpen={sidebarToggle} />
      {isRouteHasAccess ? (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: `${sidebarToggle ? EXPANDED_WIDTH : COLLAPSED_WIDTH}px`,
            mt: `${LOGO_HEIGHT}px`,
            transition: "margin-left 0.25s ease",
            minHeight: `calc(100vh - ${LOGO_HEIGHT}px)`,
          }}
        >
          {props.children}
        </Box>
      ) : (
        <ErrorBoundary type="unauthorized" />
      )}
    </Box>
  );
}

export default Layout;
