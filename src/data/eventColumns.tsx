import { RowActions } from "@/components/DataGrid/RowActions";
import type { DataGridColumn } from "@/components/DataGrid/DataGrid.types";
import { Pill } from "@/components/Pill/Pill";
import type { Event } from "@/types/event";

type GetEventColumnsParams = {
	onEdit: (event: Event) => void;
	onRemove: (event: Event) => void;
};

const priorityRank: Record<Event["priority"], number> = {
	low: 1,
	medium: 2,
	high: 3,
	critical: 4,
};

function formatDate(date: string) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

export function getEventColumns({
	onEdit,
	onRemove,
}: GetEventColumnsParams): DataGridColumn<Event>[] {
	return [
		{
			id: "title",
			label: "Title",
			accessor: "title",
			sortable: true,
			filterAccessor: "title",
			searchable: true,
			enableHiding: false,
		},
		{
			id: "date",
			label: "Date",
			accessor: (event) => formatDate(event.date),
			filterable: true,
			filter: {
				type: "date-range",
				key: "date",
				label: "Date",
			},
			filterAccessor: "date",
			sortAccessor: "date",
			sortable: true,
		},
		{
			id: "category",
			label: "Category",
			cell: (event) => <Pill group="category" value={event.category} />,
			sortable: true,
			filterable: true,
			filter: {
				type: "multi-select",
				key: "category",
				label: "Category",
			},
			filterAccessor: "category",
			sortAccessor: "category",
			enableHiding: false,
		},
		{
			id: "status",
			label: "Status",
			cell: (event) => <Pill group="status" value={event.status} />,
			sortable: true,
			filterable: true,
			filter: {
				type: "multi-select",
				key: "status",
				label: "Status",
			},
			filterAccessor: "status",
			sortAccessor: "status",
		},
		{
			id: "priority",
			label: "Priority",
			cell: (event) => <Pill group="priority" value={event.priority} />,
			sortable: true,
			filterable: true,
			filter: {
				type: "multi-select",
				key: "priority",
				label: "Priority",
			},
			filterAccessor: "priority",
			sortAccessor: (event) => priorityRank[event.priority],
			enableHiding: false,
		},
		{
			id: "description",
			label: "Description",
			accessor: "description",
			sortable: false,
			filterable: false,
		},
		{
			id: "actions",
			label: "Actions",
			cell: (event) => (
				<RowActions row={event} onEdit={onEdit} onRemove={onRemove} />
			),
			sortable: false,
			filterable: false,
			enableHiding: false,
		},
	];
}
