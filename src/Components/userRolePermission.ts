import { useParams } from "react-router-dom";
import { IMenu, Role } from "./helper";

const useUserRolePermissions = () => {
  const { testId } = useParams();
  const commonMenu: IMenu[] = [
    {
      to: `/dashboard`,
      label: "Dashboard",
      roles: [Role.tenantAdmin],
      isMenu: true,
      icon: "dashboard",
    },
  ];

  const adminRoutes: IMenu[] = [
    {
      to: `/test-creation`,
      label: "Test Creation",
      roles: [Role.tenantAdmin],
      isMenu: true,
      icon: "testCreation",
    },
    {
      to: `/test-edit/${testId}`,
      label: "Test Creation",
      roles: [Role.tenantAdmin],
      isMenu: false,
      icon: "testCreation",
    },
    {
      to: `/test-tracking`,
      label: "Test Tracking",
      roles: [Role.tenantAdmin],
      isMenu: true,
      icon: "testTracking",
    },
  ];

  const combinedMenu = [...commonMenu, ...adminRoutes];

  return {
    combinedMenu,
  };
};

export default useUserRolePermissions;
