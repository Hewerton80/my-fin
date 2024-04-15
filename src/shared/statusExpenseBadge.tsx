import { Badge } from "@/components/ui/dataDisplay/Badge";
import { ExpenseStatus } from "@/types/Expense";

type BadgeVariatnsType = {
  [key in keyof typeof ExpenseStatus]: JSX.Element;
};

// export const expenseBadge: BadgeVariatnsType = {
//   PAID: <Badge variant="success">{ExpenseStatus.PAID}</Badge>,
//   OVERDUE: <Badge variant="danger">{ExpenseStatus.OVERDUE}</Badge>,
//   PENDING: <Badge variant="warning">{ExpenseStatus.PENDING}</Badge>,
//   "ON DAY": <Badge variant="warning">{ExpenseStatus["ON DAY"]}</Badge>,
// };

export const getExpenseBadge = (status: keyof typeof ExpenseStatus) => {
  const statusLowerCase = status.toLowerCase();
  const expenseBadge: BadgeVariatnsType = {
    PAID: <Badge variant="success">{statusLowerCase}</Badge>,
    OVERDUE: <Badge variant="danger">{statusLowerCase}</Badge>,
    PENDING: <Badge variant="warning">{statusLowerCase}</Badge>,
    "ON DAY": <Badge variant="info">{statusLowerCase}</Badge>,
  };
  return expenseBadge[status];
};
