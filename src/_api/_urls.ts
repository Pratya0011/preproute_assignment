import { config } from "../config";

export const baseURL = `${config.baseUrl ? config.baseUrl : "/api"}`;
