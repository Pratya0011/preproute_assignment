import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  TrendingUpOutlined,
  EditOutlined,
  AssignmentOutlined,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Sidebar.scss";

export const EXPANDED_WIDTH = 240;
export const COLLAPSED_WIDTH = 64;
export const LOGO_HEIGHT = 41;

const navItems = [
  { label: "Dashboard", icon: <TrendingUpOutlined />, path: "/" },
  { label: "Test Creation", icon: <EditOutlined />, path: "/test-creation" },
  {
    label: "Test Tracking",
    icon: <AssignmentOutlined />,
    path: "/test-tracking",
  },
];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

function Sidebar({ open, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box className="sidebar-wrapper">
      {/* Logo — always visible, never collapses */}
      <Box
        className="sidebar-logo"
        sx={{ width: EXPANDED_WIDTH, height: LOGO_HEIGHT }}
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
            top: LOGO_HEIGHT,
          },
        }}
      >
        <List disablePadding className="nav-list">
          {navItems.map(({ label, icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Tooltip key={label} title={open ? "" : label} placement="right">
                <ListItemButton
                  selected={isActive}
                  onClick={() => navigate(path)}
                  className="nav-item"
                  sx={{
                    justifyContent: open ? "flex-start" : "center",
                    px: open ? 1.5 : 1,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: open ? 36 : "auto",
                      color: isActive ? "#4F63F5" : "#6B7280",
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: 14,
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? "#4F63F5" : "#6B7280",
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
