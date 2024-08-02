import { memo } from "react";
import { TransitionHistoryWitchConputedFields } from "../types";
import { Dropdown } from "@/components/ui/overlay/Dropdown/Dropdown";
import { IconButton } from "@/components/ui/buttons/IconButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPen } from "react-icons/fa";

interface TableTransitionActionsButtonsProps {
  transitionHistory?: TransitionHistoryWitchConputedFields;
  onClickToEdit?: () => void;
  onClickToClone?: () => void;
  onSuccess?: () => void;
}

export const TableTransitionActionsButtons = memo(
  function TableTransitionActionsButtons({
    transitionHistory,
    onSuccess,
    onClickToEdit,
    onClickToClone,
  }: TableTransitionActionsButtonsProps) {
    return (
      <>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <IconButton
              variantStyle="dark-ghost"
              icon={<BsThreeDotsVertical />}
            />
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item className="gap-2" onClick={onClickToEdit}>
              <FaPen />
              Edit
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </>
    );
  }
);
