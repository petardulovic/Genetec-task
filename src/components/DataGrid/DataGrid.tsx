import { useMemo, useState } from "react";

import type {
	DataGridFilterableRow,
	DataGridFilters,
	DataGridProps,
	PageSize,
	SortState,
} from "./DataGrid.types";
import { NoResultsFoundPage } from "@/pages/NoResultsFound";
import { Loader } from "../Loader/Loader";
import { DataGridTable } from "./DataGridTable";
import { FilterToolbar } from "./FilterToolbar";
import { sortRows } from "./sorting";
import "./DataGrid.css";

const DEFAULT_FILTERS: DataGridFilters = {
	search: "",
	statuses: [],
	priorities: [],
	categories: [],
	dateFrom: "",
	dateTo: "",
};

function getUniqueOptions<T extends DataGridFilterableRow>(
	data: T[],
	key: "category" | "status" | "priority",
) {
	return Array.from(
		new Set(data.map((row) => row[key]).filter(Boolean) as string[]),
	).sort((first, second) => first.localeCompare(second));
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
	filters: DataGridFilters,
) {
	const searchTerm = filters.search.trim().toLowerCase();

	return data.filter((row) => {
		const title = row.title?.toLowerCase() ?? "";
		const rowDate = getDateValue(row.date);

		return (
			(searchTerm === "" || title.includes(searchTerm)) &&
			(filters.categories.length === 0 ||
				(row.category !== undefined &&
					filters.categories.includes(row.category))) &&
			(filters.statuses.length === 0 ||
				(row.status !== undefined && filters.statuses.includes(row.status))) &&
			(filters.priorities.length === 0 ||
				(row.priority !== undefined &&
					filters.priorities.includes(row.priority))) &&
			(filters.dateFrom === "" || rowDate >= filters.dateFrom) &&
			(filters.dateTo === "" || rowDate <= filters.dateTo)
		);
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

	const categoryOptions = useMemo(
		() => getUniqueOptions(data, "category"),
		[data],
	);
	const statusOptions = useMemo(() => getUniqueOptions(data, "status"), [data]);
	const priorityOptions = useMemo(
		() => getUniqueOptions(data, "priority"),
		[data],
	);

	const filteredData = useMemo(() => {
		if (visibleColumns.length === 0) {
			console.warn("No visible columns provided to DataGrid.");
		}

		return filterRows(data, filters);
	}, [data, filters, visibleColumns.length]);
	const sortedData = useMemo(
		() => sortRows(filteredData, columns, sortState),
		[columns, filteredData, sortState],
	);

	const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
	const safeCurrentPage = Math.min(currentPage, totalPages);
	const startIndex = (safeCurrentPage - 1) * pageSize;
	const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

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
		return <p role="alert">{error}</p>;
	}

	if (data.length === 0) {
		return <NoResultsFoundPage />;
	}

	return (
		<div className="data-grid">
			<FilterToolbar
				filters={filters}
				pageSize={pageSize}
				categoryOptions={categoryOptions}
				statusOptions={statusOptions}
				priorityOptions={priorityOptions}
				columnOptions={columnVisibilityOptions}
				onFiltersChange={handleFiltersChange}
				onPageSizeChange={handlePageSizeChange}
				onColumnVisibilityChange={handleColumnVisibilityChange}
				onResetFilters={() => handleFiltersChange(DEFAULT_FILTERS)}
			/>

			<section className="results-panel">
				<header className="results-heading">
					<h2>Events</h2>
				</header>

				{filteredData.length === 0 ? (
					<NoResultsFoundPage />
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
								{sortedData.length} events
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
