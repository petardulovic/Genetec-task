import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

import type {
	ColumnVisibilityOption,
	DataGridFilters,
	PageSize,
} from "./DataGrid.types";

type FilterToolbarProps = {
	filters: DataGridFilters;
	pageSize: PageSize;
	categoryOptions: string[];
	statusOptions: string[];
	priorityOptions: string[];
	columnOptions: ColumnVisibilityOption[];
	onFiltersChange: (filters: DataGridFilters) => void;
	onPageSizeChange: (pageSize: PageSize) => void;
	onColumnVisibilityChange: (columnId: string, isVisible: boolean) => void;
	onResetFilters: () => void;
};

type FilterKey = "categories" | "statuses" | "priorities";

const PAGE_SIZE_OPTIONS: PageSize[] = [10, 25, 50, 100];

function formatOptionLabel(option: string) {
	return option
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function toggleFilterValue(values: string[], value: string) {
	return values.includes(value)
		? values.filter((item) => item !== value)
		: [...values, value];
}

function getDropdownLabel(label: string, selectedCount: number) {
	return selectedCount > 0 ? `${label} (${selectedCount})` : label;
}

export function FilterToolbar({
	filters,
	pageSize,
	categoryOptions,
	statusOptions,
	priorityOptions,
	columnOptions,
	onFiltersChange,
	onPageSizeChange,
	onColumnVisibilityChange,
	onResetFilters,
}: FilterToolbarProps) {
	const hasActiveFilters =
		filters.search.trim() !== "" ||
		filters.categories.length > 0 ||
		filters.statuses.length > 0 ||
		filters.priorities.length > 0 ||
		filters.dateFrom !== "" ||
		filters.dateTo !== "";

	function handleFilterToggle(filterKey: FilterKey, value: string) {
		onFiltersChange({
			...filters,
			[filterKey]: toggleFilterValue(filters[filterKey], value),
		});
	}

	return (
		<section className="filters-panel" aria-label="Data grid filters">
			<div className="filter-fields">
				<label className="filter-control search-control">
					<span>Search title</span>
					<input
						type="search"
						value={filters.search}
						placeholder="Search by title"
						onChange={(event) =>
							onFiltersChange({
								...filters,
								search: event.target.value,
							})
						}
					/>
				</label>

				<label className="filter-control">
					<span>Rows</span>
					<select
						value={pageSize}
						onChange={(event) =>
							onPageSizeChange(Number(event.target.value) as PageSize)
						}
					>
						{PAGE_SIZE_OPTIONS.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</label>

				<DatePicker
					label="Date from"
					value={filters.dateFrom}
					onChange={(dateFrom) =>
						onFiltersChange({
							...filters,
							dateFrom,
						})
					}
				/>

				<DatePicker
					label="Date to"
					value={filters.dateTo}
					onChange={(dateTo) =>
						onFiltersChange({
							...filters,
							dateTo,
						})
					}
				/>

				<button
					type="button"
					className="clear-filters-button"
					disabled={!hasActiveFilters}
					onClick={onResetFilters}
				>
					Reset
				</button>
			</div>

			<div className="filter-menus">
				<MultiSelectDropdown
					label="Category"
					options={categoryOptions}
					values={filters.categories}
					onToggle={(value) => handleFilterToggle("categories", value)}
				/>

				<MultiSelectDropdown
					label="Status"
					options={statusOptions}
					values={filters.statuses}
					onToggle={(value) => handleFilterToggle("statuses", value)}
				/>

				<MultiSelectDropdown
					label="Priority"
					options={priorityOptions}
					values={filters.priorities}
					onToggle={(value) => handleFilterToggle("priorities", value)}
				/>

				<ColumnsDropdown
					columns={columnOptions}
					onColumnVisibilityChange={onColumnVisibilityChange}
				/>
			</div>
		</section>
	);
}

type DatePickerProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
};

function DatePicker({ label, value, onChange }: DatePickerProps) {
	return (
		<label className="filter-control">
			<span>{label}</span>
			<input
				type="date"
				value={value}
				onChange={(event) => onChange(event.target.value)}
			/>
		</label>
	);
}

type MultiSelectDropdownProps = {
	label: string;
	options: string[];
	values: string[];
	onToggle: (value: string) => void;
};

function MultiSelectDropdown({
	label,
	options,
	values,
	onToggle,
}: MultiSelectDropdownProps) {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className="menu-filter-button">
				<span>{getDropdownLabel(label, values.length)}</span>
				<ChevronDownIcon aria-hidden="true" />
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="filter-menu"
					align="start"
					sideOffset={6}
				>
					{options.map((option) => (
						<DropdownMenu.CheckboxItem
							key={option}
							className="filter-option"
							checked={values.includes(option)}
							onCheckedChange={() => onToggle(option)}
							onSelect={(event) => event.preventDefault()}
						>
							<span className="option-checkmark" aria-hidden="true">
								<CheckIcon />
							</span>
							{formatOptionLabel(option)}
						</DropdownMenu.CheckboxItem>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

type ColumnsDropdownProps = {
	columns: ColumnVisibilityOption[];
	onColumnVisibilityChange: (columnId: string, isVisible: boolean) => void;
};

function ColumnsDropdown({
	columns,
	onColumnVisibilityChange,
}: ColumnsDropdownProps) {
	const hideableColumns = columns.filter((column) => column.canHide);
	const visibleCount = hideableColumns.filter((column) => column.isVisible).length;

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className="menu-filter-button">
				<span>Columns ({visibleCount})</span>
				<ChevronDownIcon aria-hidden="true" />
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="filter-menu"
					align="start"
					sideOffset={6}
				>
					{hideableColumns.map((column) => (
						<DropdownMenu.CheckboxItem
							key={column.id}
							className="filter-option"
							checked={column.isVisible}
							onCheckedChange={(checked) =>
								onColumnVisibilityChange(column.id, checked === true)
							}
							onSelect={(event) => event.preventDefault()}
						>
							<span className="option-checkmark" aria-hidden="true">
								<CheckIcon />
							</span>
							{column.label}
						</DropdownMenu.CheckboxItem>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
