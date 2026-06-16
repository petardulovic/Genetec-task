import type { DataGridColumn, SortDirection, SortState } from "./DataGrid.types";

const priorityRank: Record<string, number> = {
	low: 1,
	medium: 2,
	high: 3,
	critical: 4,
};

function isSortableValue(value: unknown): value is string | number | boolean {
	return ["string", "number", "boolean"].includes(typeof value);
}

function getSortValue<T>(row: T, column: DataGridColumn<T>) {
	const rowValue = row[column.id as keyof T];
	const accessor = column.accessor;

	if (isSortableValue(rowValue)) {
		return String(rowValue);
	}

	if (typeof accessor === "function") {
		const accessorValue = accessor(row);

		if (isSortableValue(accessorValue)) {
			return String(accessorValue);
		}
	} else if (accessor) {
		const accessorValue = row[accessor];

		if (isSortableValue(accessorValue)) {
			return String(accessorValue);
		}
	}

	return "";
}

function compareStringValues(
	firstValue: string,
	secondValue: string,
	direction: SortDirection,
) {
	const comparison = firstValue.localeCompare(secondValue, undefined, {
		numeric: true,
		sensitivity: "base",
	});

	return direction === "asc" ? comparison : -comparison;
}

function comparePriorityValues(
	firstValue: string,
	secondValue: string,
	direction: SortDirection,
) {
	const firstRank = priorityRank[firstValue.toLowerCase()] ?? 0;
	const secondRank = priorityRank[secondValue.toLowerCase()] ?? 0;
	const comparison = firstRank - secondRank;

	return direction === "asc" ? comparison : -comparison;
}

export function sortRows<T>(
	rows: T[],
	columns: DataGridColumn<T>[],
	sortState: SortState,
) {
	if (!sortState) {
		return rows;
	}

	const sortColumn = columns.find((column) => column.id === sortState.columnId);

	if (!sortColumn || sortColumn.sortable !== true) {
		return rows;
	}

	return [...rows].sort((firstRow, secondRow) =>
		sortColumn.id === "priority"
			? comparePriorityValues(
					getSortValue(firstRow, sortColumn),
					getSortValue(secondRow, sortColumn),
					sortState.direction,
				)
			: compareStringValues(
					getSortValue(firstRow, sortColumn),
					getSortValue(secondRow, sortColumn),
					sortState.direction,
				),
	);
}
