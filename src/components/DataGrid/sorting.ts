import type { DataGridColumn, SortDirection, SortState } from "./DataGrid.types";

type SortableValue = string | number | boolean | Date;

function isSortableValue(value: unknown): value is SortableValue {
	return (
		["string", "number", "boolean"].includes(typeof value) ||
		value instanceof Date
	);
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
			return value;
		}
	}

	return "";
}

function compareSortableValues(
	firstValue: SortableValue,
	secondValue: SortableValue,
	direction: SortDirection,
) {
	const comparison = getComparison(firstValue, secondValue);

	return direction === "asc" ? comparison : -comparison;
}

function getComparison(firstValue: SortableValue, secondValue: SortableValue) {
	if (firstValue instanceof Date && secondValue instanceof Date) {
		return firstValue.getTime() - secondValue.getTime();
	}

	if (
		typeof firstValue === "number" &&
		typeof secondValue === "number"
	) {
		return firstValue - secondValue;
	}

	if (
		typeof firstValue === "boolean" &&
		typeof secondValue === "boolean"
	) {
		return Number(firstValue) - Number(secondValue);
	}

	return String(firstValue).localeCompare(String(secondValue), undefined, {
			numeric: true,
			sensitivity: "base",
	});
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
		compareSortableValues(
			getSortValue(firstRow, sortColumn),
			getSortValue(secondRow, sortColumn),
			sortState.direction,
		),
	);
}
