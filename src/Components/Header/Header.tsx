import { useState } from "react";
import {
  Box,
  IconButton,
  Avatar,
  Badge,
  Popover,
  Divider,
} from "@mui/material";
import {
  NotificationsOutlined,
  KeyboardArrowDown,
  LogoutOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../../_store/store";
import {
  EXPANDED_WIDTH,
  COLLAPSED_WIDTH,
  LOGO_HEIGHT,
} from "../Sidebar/Sidebar";
import "./Header.scss";
import avatar from "../../assets/avatar.png";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  sidebarOpen: boolean;
}

function Header({ sidebarOpen }: HeaderProps) {
  const navigate = useNavigate();
  const loggedInUserDetails: any = useSelector(
    (state: RootState) => state.common.loggedInUserDetails,
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const fullName =
    loggedInUserDetails?.name || loggedInUserDetails?.fullName || "Alex Wando";
  const role = loggedInUserDetails?.role
    ? loggedInUserDetails.role.charAt(0).toUpperCase() +
      loggedInUserDetails.role.slice(1)
    : "Admin";
  const email = loggedInUserDetails?.email || "";
  const tenant = loggedInUserDetails?.tenant || "";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box
      className="header"
      sx={{
        left: sidebarOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        height: LOGO_HEIGHT,
      }}
    >
      {/* Notification bell */}
      <IconButton size="small" className="notification-btn">
        <Badge
          variant="dot"
          sx={{
            "& .MuiBadge-dot": {
              backgroundColor: "#22C55E",
              width: 8,
              height: 8,
              borderRadius: "50%",
              border: "1.5px solid #fff",
            },
          }}
        >
          <NotificationsOutlined className="notification-icon" />
        </Badge>
      </IconButton>

      <span className="header-divider" />

      {/* User profile */}
      <Box
        className="user-profile"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Avatar
          src={avatar || ""}
          sx={{
            width: 34,
            height: 34,
            bgcolor: "#ffd284",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {initials}
        </Avatar>
        <Box className="user-info">
          <span className="user-name">{fullName}</span>
          <span className="user-role">{role}</span>
        </Box>
        <KeyboardArrowDown
          className="dropdown-icon"
          sx={{
            transform: anchorEl ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </Box>

      {/* Profile popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { className: "profile-popover" } }}
      >
        <Box className="popover-content">
          <Avatar
            src={avatar || ""}
            sx={{
              width: 56,
              height: 56,
              fontSize: 20,
              fontWeight: 600,
              mb: 1.5,
              background: "#ffd284",
            }}
          >
            {initials}
          </Avatar>
          <span className="popover-role">{role}</span>
          <span className="popover-name">{fullName}</span>
          {email && <span className="popover-email">{email}</span>}
          {tenant && <span className="popover-tenant">Tenant: {tenant}</span>}
        </Box>

        <Divider />

        <Box className="popover-logout" onClick={handleLogout}>
          <LogoutOutlined className="logout-icon" />
          <span className="logout-text">Logout</span>
        </Box>
      </Popover>
    </Box>
  );
}

export default Header;
