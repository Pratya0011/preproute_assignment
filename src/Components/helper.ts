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

export const findByName = <T extends { id: string; name: string }>(
  name: string,
  arr: T[],
): T | undefined => arr.find((item) => item.name === name);

export const filterIdByName = (data: string[], arr: { id: string; name: string }[]): string[] => {
  return data
    .map((name) => arr.find((item) => item.name === name)?.id)
    .filter(Boolean) as string[];
};
