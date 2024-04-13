export interface IPagined<T> {
  pages?: number;
  count?: number;
  data?: T[];
}
