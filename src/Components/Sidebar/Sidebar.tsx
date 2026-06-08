import {
  AssignmentOutlined,
  EditOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import useUserRolePermissions from "../userRolePermission";
import "./Sidebar.scss";

export const EXPANDED_WIDTH = 240;
export const COLLAPSED_WIDTH = 64;
export const LOGO_HEIGHT = 41;

interface SidebarProps {
  open: boolean;
}

function Sidebar({ open }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const menuObj: any = useUserRolePermissions();

  const getMenuIcon = useCallback((iconName: string) => {
    switch (iconName) {
      case "dashboard":
        return <TrendingUpOutlined />;
      case "testCreation":
        return <EditOutlined />;
      case "testTracking":
        return <AssignmentOutlined />;
    }
  }, []);

  return (
    <Box
      className="sidebar-wrapper"
      sx={{
        borderRight: open ? "1px solid #e5e7eb" : "none",
      }}
    >
      {/* Logo — always visible, never collapses */}
      <Box
        className="sidebar-logo"
        sx={{
          width: EXPANDED_WIDTH,
          height: LOGO_HEIGHT,
          borderBottom: !open ? "1px solid #e5e7eb" : "none",
          borderRight: !open ? "1px solid #e5e7eb" : "none",
          paddingBottom: !open ? 10 : 0,
        }}
      >
        <img src={logo} alt="Preproute" height="41px" />
      </Box>

      {/* Collapsible drawer — nav items only */}
      <Drawer
        variant="permanent"
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
            height: `calc(100vh - ${LOGO_HEIGHT}px)`,
            top: open ? LOGO_HEIGHT : 0,
            borderRight: !open ? "1px solid #e5e7eb" : "none",
          },
        }}
      >
        <List disablePadding className="nav-list">
          {menuObj.combinedMenu.map((item: any) => {
            const isActive = location.pathname === item.to;
            return (
              <Tooltip
                key={item?.label}
                title={open ? "" : item?.label}
                placement="right"
              >
                <ListItemButton
                  selected={isActive}
                  onClick={() => navigate(item.to)}
                  className="nav-item"
                  sx={{
                    justifyContent: open ? "flex-start" : "center",
                    px: open ? 1.5 : 1,
                    borderLeft: isActive ? "5px solid #384EC7" : "none",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: open ? 36 : "auto",
                      color: isActive ? "#384EC7" : "#6B7280",
                    }}
                  >
                    {getMenuIcon(item?.icon)}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item?.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: 16,
                            fontWeight: 500,
                            color: isActive ? "#384EC7" : "#6B7180",
                          },
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
