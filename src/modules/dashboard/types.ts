export enum DashboardQueryKeys {
  LIST = "DASHBOARD_LIST",
}

export interface Insights {
  name?: string;
  amount?: number;
  count?: number | string;
}
export interface Dashboard {
  insights: Insights[];
}
