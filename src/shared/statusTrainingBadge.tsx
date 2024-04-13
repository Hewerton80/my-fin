import { Badge } from "@/components/ui/dataDisplay/Badge";

// type BadgeVariatnsType = {
//   [key in keyof typeof TrainingStatus]: JSX.Element;
// };

export const statusTrainingBadge = {
  inProgress: <Badge variant="primary">{"TrainingStatus.inProgress"}</Badge>,
  finished: <Badge variant="success">{"TrainingStatus.finished"}</Badge>,
  incomplete: <Badge variant="warning">{"TrainingStatus.incomplete"}</Badge>,
};
