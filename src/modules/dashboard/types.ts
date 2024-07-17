export enum DashboardQueryKeys {
  LIST = "DASHBOARD_LIST",
}

interface BaseInsights {
  name: string;
  amount: number;
  count: number | string;
}

export interface CategoryInsights extends BaseInsights {
  id: string;
  iconName: string;
}

export interface CreditCardInsights extends BaseInsights {
  color?: string;
}

export interface FrequencyInsights extends BaseInsights {}

export interface PaymentTypeInsights extends BaseInsights {}

export interface HistoricInsights {
  name: string;
  receiptsAmount: number;
  paymentsAmount: number;
}
export interface HistoricPaymentsInsights extends BaseInsights {}
export interface HistoricReceiptsInsights extends BaseInsights {}

export interface Dashboard {
  categoryInsights: CategoryInsights[];
  creditCardInsights: CreditCardInsights[];
  paymentTypeInsights: PaymentTypeInsights[];
  frequencyInsights: FrequencyInsights[];
  historicInsights: HistoricInsights[];
}
