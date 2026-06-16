import type { DataGridColumn, SortDirection, SortState } from "./DataGrid.types";

function isSortableValue(value: unknown): value is string | number | boolean {
	return ["string", "number", "boolean"].includes(typeof value);
}

function readColumnValue<T>(
	row: T,
	reader?: keyof T | ((row: T) => unknown),
) {
	if (!reader) {
		return undefined;
	}

	if (typeof reader === "function") {
		return reader(row);
	}

	return row[reader];
}

function getSortValue<T>(row: T, column: DataGridColumn<T>) {
	const values = [
		readColumnValue(row, column.sortAccessor),
		row[column.id as keyof T],
		readColumnValue(row, column.accessor),
	];

	for (const value of values) {
		if (isSortableValue(value)) {
			return String(value);
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
		compareStringValues(
			getSortValue(firstRow, sortColumn),
			getSortValue(secondRow, sortColumn),
			sortState.direction,
		),
	);
}
