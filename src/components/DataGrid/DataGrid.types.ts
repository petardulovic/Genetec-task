import type { ReactNode } from "react";

export type DataGridColumnFilter = {
	type: "multi-select" | "date-range";
	key: string;
	label?: string;
};

export type DataGridColumn<T> = {
	id: string;
	label: string;
	accessor?: keyof T | ((row: T) => ReactNode);
	cell?: (row: T) => ReactNode;
	sortable?: boolean;
	sortAccessor?:
		| keyof T
		| ((row: T) => string | number | boolean | null | undefined);
	filterable?: boolean;
	filter?: DataGridColumnFilter;
	filterAccessor?: keyof T | ((row: T) => string | null | undefined);
	searchable?: boolean;
	visible?: boolean;
	enableHiding?: boolean;
};

export type DataGridProps<T> = {
	data: T[];
	columns: DataGridColumn<T>[];
	loading?: boolean;
	error?: string | null;
};

export type DataGridFilterableRow = {
	id: string;
};

export type DataGridFilters = {
	search: string;
	multiSelect: Record<string, string[]>;
	dateRanges: Record<string, DataGridDateRangeFilter>;
};

export type DataGridDateRangeFilter = {
	from: string;
	to: string;
};

export type MultiSelectFilterOption = {
	key: string;
	label: string;
	options: string[];
	values: string[];
};

export type DateRangeFilterOption = {
	key: string;
	label: string;
	value: DataGridDateRangeFilter;
};

export type ColumnVisibilityOption = {
	id: string;
	label: string;
	isVisible: boolean;
	canHide: boolean;
};

export type SortDirection = "asc" | "desc";

export type SortState = {
	columnId: string;
	direction: SortDirection;
} | null;

export type PageSize = 10 | 25 | 50 | 100;
