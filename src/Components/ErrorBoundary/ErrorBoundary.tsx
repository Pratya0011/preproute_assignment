import { Component, ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";
import { LockOutlined, ErrorOutlineOutlined } from "@mui/icons-material";
import "./ErrorBoundary.scss";

interface Props {
  children?: ReactNode;
  type?: "unauthorized" | "error";
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    const { type = "unauthorized" } = this.props;
    const isUnauthorized = !this.props.children || type === "unauthorized";
    const isError = this.state.hasError || type === "error";

    if (isError || isUnauthorized) {
      return (
        <Box className="error-boundary-wrapper">
          <Box
            className="error-icon-circle"
            sx={{ backgroundColor: isError ? "#FEF2F2" : "#EEF0FE" }}
          >
            {isError ? (
              <ErrorOutlineOutlined className="error-icon" sx={{ color: "#EF4444" }} />
            ) : (
              <LockOutlined className="error-icon" sx={{ color: "#4F63F5" }} />
            )}
          </Box>

          <Typography className="error-title">
            {isError ? "Something went wrong" : "Access Denied"}
          </Typography>

          <Typography className="error-description">
            {isError
              ? "An unexpected error occurred. Please try refreshing the page."
              : "You do not have permission to view this page. Contact your administrator if you think this is a mistake."}
          </Typography>

          {isError && (
            <Button
              variant="contained"
              className="error-refresh-btn"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
