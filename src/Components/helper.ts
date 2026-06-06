export const Role = {
  tenantAdmin: "admin",
};
export interface IMenu {
  to?: string;
  label: string;
  roles: Array<string>;
  isMenu: boolean;
  icon: string;
  subMenu?: IMenu[];
  menuPaths?: string[];
}

export const createQueryParams = (payload: any) => {
  const p: any = {};
  Object.keys(payload).forEach((key) => {
    if (payload[key] || (payload[key] == 0 && payload[key] !== "")) {
      p[key] = payload[key];
    }
  });
  return "?" + new URLSearchParams(p).toString();
};
