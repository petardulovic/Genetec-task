import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

type RowActionsProps<T extends { id: string; title?: string }> = {
	row: T;
	onEdit?: (row: T) => void;
	onRemove?: (row: T) => void;
};

export function RowActions<T extends { id: string; title?: string }>({
	row,
	onEdit,
	onRemove,
}: RowActionsProps<T>) {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				className="actions-button"
				data-event-id={row.id}
				aria-label={`Open actions for ${row.title ?? row.id}`}>
				<DotsHorizontalIcon />
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content className="actions-menu" align="end">
					<DropdownMenu.Item
						className="actions-menu-choice"
						data-event-id={row.id}
						data-action="edit"
						onSelect={() => onEdit?.(row)}>
						Edit event
					</DropdownMenu.Item>

					<DropdownMenu.Item
						className="actions-menu-choice"
						data-event-id={row.id}
						data-action="remove"
						onSelect={() => onRemove?.(row)}>
						Remove event
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
