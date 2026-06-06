import { IMenu, Role } from "./helper";

const useUserRolePermissions = () => {
  const commonMenu: IMenu[] = [
    {
      to: `/dashboard`,
      label: "Dashboard",
      roles: [Role.tenantAdmin],
      isMenu: false,
      icon: "dashboard",
    },
  ];

  const adminRoutes: IMenu[] = [
    {
      to: `/test-creation`,
      label: "Test Creation",
      roles: [Role.tenantAdmin],
      isMenu: false,
      icon: "testCreation",
    },
    {
      to: `/test-tracking`,
      label: "Test Tracking",
      roles: [Role.tenantAdmin],
      isMenu: false,
      icon: "testTracking",
    },
  ];

  const combinedMenu = [...commonMenu, ...adminRoutes];

  return {
    combinedMenu,
  };
};

export default useUserRolePermissions;
