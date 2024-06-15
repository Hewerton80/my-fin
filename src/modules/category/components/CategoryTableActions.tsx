import { IconButton } from "@/components/ui/buttons/IconButton";
import { Dropdown } from "@/components/ui/overlay/Dropdown/Dropdown";
import { IoIosStats } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";

interface CategoryTableActionsProps {
  id: string;
}

export function CategoryTableActions({ id }: CategoryTableActionsProps) {
  return (
    <>
      <Dropdown.Root>
        <Dropdown.Toogle asChild>
          <IconButton
            variantStyle="light-ghost"
            icon={<BsThreeDotsVertical />}
          />
        </Dropdown.Toogle>
        <Dropdown.Menu>
          <Dropdown.Item className="gap-2" asChild>
            <Link href={`/categories/${id}`}>
              <IoIosStats /> Stats
            </Link>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Root>
    </>
  );
}
