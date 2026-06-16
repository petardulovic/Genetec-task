import type { ReactNode } from "react";
import {
	CaretDownIcon,
	CaretSortIcon,
	CaretUpIcon,
} from "@radix-ui/react-icons";

import type { DataGridColumn, SortState } from "./DataGrid.types";

type DataGridTableProps<T> = {
	data: T[];
	visibleColumns: DataGridColumn<T>[];
	sortState: SortState;
	onSortChange: (columnId: string) => void;
};

function getCellValue<T>(row: T, column: DataGridColumn<T>): ReactNode {
	if (column.cell) {
		return column.cell(row);
	}

	if (typeof column.accessor === "function") {
		return column.accessor(row);
	}

	if (column.accessor) {
		return row[column.accessor] as ReactNode;
	}

	return null;
}

function getSortIcon(columnId: string, sortState: SortState) {
	if (sortState?.columnId !== columnId) {
		return <CaretSortIcon />;
	}

	return sortState.direction === "asc" ? <CaretUpIcon /> : <CaretDownIcon />;
}

export function DataGridTable<T extends { id: string }>({
	data,
	visibleColumns,
	sortState,
	onSortChange,
}: DataGridTableProps<T>) {
	return (
		<div className="table-viewport">
			<table>
				<thead>
					<tr>
						{visibleColumns.map((column) => (
							<th
								key={column.id}
								className={`table-cell ${column.id}-column`}
								aria-sort={
									sortState?.columnId === column.id
										? sortState.direction === "asc"
											? "ascending"
											: "descending"
										: undefined
								}
								scope="col">
								{column.sortable ? (
									<button
										type="button"
										className="sort-button"
										onClick={() => onSortChange(column.id)}>
										<span>{column.label}</span>
										<span aria-hidden="true" className="sort-indicator">
											{getSortIcon(column.id, sortState)}
										</span>
									</button>
								) : (
									column.label
								)}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{data.map((row) => (
						<tr key={row.id} data-event-id={row.id}>
							{visibleColumns.map((column) => (
								<td
									key={column.id}
									className={`table-cell ${column.id}-column`}>
									{getCellValue(row, column)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
