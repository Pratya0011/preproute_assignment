import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";

const PageLoader = () => (
  <LinearProgress
    sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 99998 }}
  />
);

const Root = lazy(() => import("./Root"));
const AuthWrapper = lazy(() => import("./authWrapper"));
const Dashboard = lazy(() => import("./Components/Dashboard/Dashboard"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Root />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthWrapper>
              <Navigate to="/dashboard" replace />
            </AuthWrapper>
          </Suspense>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthWrapper>
              <Dashboard />
            </AuthWrapper>
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
