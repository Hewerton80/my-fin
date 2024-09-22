import { Badge } from "@/components/ui/dataDisplay/Badge";
import { capitalizeFisrtLetter } from "@/utils/string";
import { TransitionHistoryStatus } from "@prisma/client";
import { useMemo } from "react";

type StatusType = keyof typeof TransitionHistoryStatus;
interface TransitionStatusBadgeProps {
  status: StatusType;
}

export function TransitionStatusBadge({ status }: TransitionStatusBadgeProps) {
  const getBadgeByStatus = useMemo(() => {
    const statusLowerCase = capitalizeFisrtLetter(status);
    const expenseBadge: Record<StatusType, JSX.Element> = {
      PAID: <Badge variant="success">{statusLowerCase}</Badge>,
      OVERDUE: <Badge variant="danger">{statusLowerCase}</Badge>,
      PENDING: <Badge variant="warning">{statusLowerCase}</Badge>,
      ON_DAY: <Badge variant="info">{statusLowerCase}</Badge>,
      CANCELED: <Badge variant="dark">{statusLowerCase}</Badge>,
    };
    return expenseBadge[status];
  }, [status]);

  return <>{getBadgeByStatus}</>;
}
