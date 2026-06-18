import { useEffect, useMemo, useRef, useState } from "react";

import type {
	DataGridColumn,
	DataGridFilterableRow,
	DataGridFilters,
	DataGridProps,
	PageSize,
	SortState,
} from "./DataGrid.types";
import { ErrorPage } from "@/pages/ErrorPage";
import { NoResultsFoundPage } from "@/pages/NoResultsFound";
import { Loader } from "../Loader/Loader";
import { DataGridTable } from "./DataGridTable";
import { FilterToolbar } from "./FilterToolbar";
import { sortRows } from "./sorting";
import "./DataGrid.css";

const DEFAULT_FILTERS: DataGridFilters = {
	search: "",
	multiSelect: {},
	dateRanges: {},
};

function getColumnValue<T>(
	row: T,
	reader?: keyof T | ((row: T) => string | null | undefined),
) {
	if (!reader) {
		return undefined;
	}

	const value = typeof reader === "function" ? reader(row) : row[reader];

	return typeof value === "string" ? value : undefined;
}

function getUniqueOptions<T>(data: T[], column: DataGridColumn<T>) {
	return Array.from(
		new Set(
			data
				.map((row) => getColumnValue(row, column.filterAccessor))
				.filter(Boolean) as string[],
		),
	).sort((first, second) => first.localeCompare(second));
}

function getFilterColumns<T>(
	columns: DataGridColumn<T>[],
	type: NonNullable<DataGridColumn<T>["filter"]>["type"],
) {
	return columns.filter(
		(column) => column.filterable === true && column.filter?.type === type,
	);
}

function getDateValue(date?: string) {
	if (!date) {
		return "";
	}

	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		return "";
	}

	return parsedDate.toISOString().slice(0, 10);
}

function filterRows<T extends DataGridFilterableRow>(
	data: T[],
	columns: DataGridColumn<T>[],
	filters: DataGridFilters,
) {
	const searchTerm = filters.search.trim().toLowerCase();
	const searchableColumns = columns.filter(
		(column) => column.searchable === true,
	);
	const multiSelectColumns = getFilterColumns(columns, "multi-select");
	const dateRangeColumns = getFilterColumns(columns, "date-range");

	return data.filter((row) => {
		const searchableText = searchableColumns
			.map((column) =>
				String(getColumnValue(row, column.filterAccessor) ?? "").toLowerCase(),
			)
			.join(" ");

		if (searchTerm !== "" && !searchableText.includes(searchTerm)) {
			return false;
		}

		for (const column of multiSelectColumns) {
			const filterKey = column.filter?.key;
			const selectedValues = filterKey ? filters.multiSelect[filterKey] : [];
			const rowValue = getColumnValue(row, column.filterAccessor);

			if (
				selectedValues?.length > 0 &&
				(rowValue === undefined || !selectedValues.includes(rowValue))
			) {
				return false;
			}
		}

		for (const column of dateRangeColumns) {
			const filterKey = column.filter?.key;
			const range = filterKey ? filters.dateRanges[filterKey] : undefined;
			const rowDate = getDateValue(getColumnValue(row, column.filterAccessor));

			if (!range) {
				continue;
			}

			if (range.from !== "" && rowDate < range.from) {
				return false;
			}

			if (range.to !== "" && rowDate > range.to) {
				return false;
			}
		}

		return true;
	});
}

export function DataGrid<T extends DataGridFilterableRow>({
	data,
	columns,
	loading = false,
	error = null,
}: DataGridProps<T>) {
	const [filters, setFilters] = useState<DataGridFilters>(DEFAULT_FILTERS);
	const [pageSize, setPageSize] = useState<PageSize>(25);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortState, setSortState] = useState<SortState>(null);
	const previousDataIdsRef = useRef(data.map((row) => row.id).join("|"));
	const [hiddenColumnIds, setHiddenColumnIds] = useState<string[]>(() =>
		columns
			.filter((column) => column.visible === false)
			.map((column) => column.id),
	);
	const visibleColumns = columns.filter(
		(column) => !hiddenColumnIds.includes(column.id),
	);
	const columnVisibilityOptions = columns.map((column) => ({
		id: column.id,
		label: column.label,
		isVisible: !hiddenColumnIds.includes(column.id),
		canHide: column.enableHiding !== false,
	}));

	const multiSelectFilters = useMemo(
		() =>
			getFilterColumns(columns, "multi-select").map((column) => {
				const filterKey = column.filter?.key ?? column.id;

				return {
					key: filterKey,
					label: column.filter?.label ?? column.label,
					options: getUniqueOptions(data, column),
					values: filters.multiSelect[filterKey] ?? [],
				};
			}),
		[columns, data, filters.multiSelect],
	);
	const dateRangeFilters = useMemo(
		() =>
			getFilterColumns(columns, "date-range").map((column) => {
				const filterKey = column.filter?.key ?? column.id;

				return {
					key: filterKey,
					label: column.filter?.label ?? column.label,
					value: filters.dateRanges[filterKey] ?? { from: "", to: "" },
				};
			}),
		[columns, filters.dateRanges],
	);

	const filteredData = useMemo(() => {
		return filterRows(data, columns, filters);
	}, [columns, data, filters]);

	const sortedData = useMemo(
		() => sortRows(filteredData, columns, sortState),
		[columns, filteredData, sortState],
	);

	const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
	const safeCurrentPage = Math.min(currentPage, totalPages);
	const startIndex = (safeCurrentPage - 1) * pageSize;
	const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

	useEffect(() => {
		const nextDataIds = data.map((row) => row.id).join("|");

		if (previousDataIdsRef.current === nextDataIds) {
			return;
		}

		previousDataIdsRef.current = nextDataIds;
		setCurrentPage(1);
		setSortState(null);
	}, [data]);

	function handleFiltersChange(nextFilters: DataGridFilters) {
		setFilters(nextFilters);
		setCurrentPage(1);
	}

	function handlePageSizeChange(nextPageSize: PageSize) {
		setPageSize(nextPageSize);
		setCurrentPage(1);
	}

	function handleColumnVisibilityChange(columnId: string, isVisible: boolean) {
		const column = columns.find((item) => item.id === columnId);

		if (!column || column.enableHiding === false) {
			return;
		}

		setHiddenColumnIds((currentHiddenColumnIds) =>
			isVisible
				? currentHiddenColumnIds.filter((id) => id !== columnId)
				: [...new Set([...currentHiddenColumnIds, columnId])],
		);
	}

	function handleSortChange(columnId: string) {
		setSortState((currentSortState) => {
			if (currentSortState?.columnId !== columnId) {
				return { columnId, direction: "asc" };
			}

			return {
				columnId,
				direction: currentSortState.direction === "asc" ? "desc" : "asc",
			};
		});
		setCurrentPage(1);
	}

	if (loading) {
		return <Loader />;
	}

	if (error) {
		return <ErrorPage message={error} />;
	}

	if (data.length === 0) {
		return (
			<NoResultsFoundPage
				title="No data found"
				message="There are no rows to display."
			/>
		);
	}

	return (
		<div className="data-grid">
			<FilterToolbar
				filters={filters}
				pageSize={pageSize}
				dateRangeFilters={dateRangeFilters}
				multiSelectFilters={multiSelectFilters}
				columnOptions={columnVisibilityOptions}
				onFiltersChange={handleFiltersChange}
				onPageSizeChange={handlePageSizeChange}
				onColumnVisibilityChange={handleColumnVisibilityChange}
				onResetFilters={() => handleFiltersChange(DEFAULT_FILTERS)}
			/>

			<section className="results-panel">
				<header className="results-heading">
					<h2>Results</h2>
				</header>

				{filteredData.length === 0 ? (
					<NoResultsFoundPage
						title="No results found"
						message="No rows found for the specified filters. Please try changing the search criteria."
					/>
				) : (
					<>
						<DataGridTable
							data={paginatedData}
							visibleColumns={visibleColumns}
							sortState={sortState}
							onSortChange={handleSortChange}
						/>

						<div className="table-pagination">
							<p>
								Showing {startIndex + 1}-
								{Math.min(startIndex + pageSize, sortedData.length)} of{" "}
								{sortedData.length} items
							</p>
							<div>
								<button
									type="button"
									disabled={safeCurrentPage === 1}
									onClick={() =>
										setCurrentPage((page) => Math.max(1, page - 1))
									}>
									Previous
								</button>
								<span>
									Page {safeCurrentPage} of {totalPages}
								</span>
								<button
									type="button"
									disabled={safeCurrentPage === totalPages}
									onClick={() =>
										setCurrentPage((page) => Math.min(totalPages, page + 1))
									}>
									Next
								</button>
							</div>
						</div>
					</>
				)}
			</section>
		</div>
	);
}
