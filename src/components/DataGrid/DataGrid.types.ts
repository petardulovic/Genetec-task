export type DataGridColumn<T> = {
	id: string;
	label: string;
	accessor: keyof T | ((row: T) => React.ReactNode);

	sortable?: boolean;
	filterable?: boolean;
	visible?: boolean;
};
