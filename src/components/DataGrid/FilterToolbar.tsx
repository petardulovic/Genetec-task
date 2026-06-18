import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

import type {
	ColumnVisibilityOption,
	DateRangeFilterOption,
	DataGridFilters,
	MultiSelectFilterOption,
	PageSize,
} from "./DataGrid.types";

type FilterToolbarProps = {
	filters: DataGridFilters;
	pageSize: PageSize;
	dateRangeFilters: DateRangeFilterOption[];
	multiSelectFilters: MultiSelectFilterOption[];
	columnOptions: ColumnVisibilityOption[];
	onFiltersChange: (filters: DataGridFilters) => void;
	onPageSizeChange: (pageSize: PageSize) => void;
	onColumnVisibilityChange: (columnId: string, isVisible: boolean) => void;
	onResetFilters: () => void;
};

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
	dateRangeFilters,
	multiSelectFilters,
	columnOptions,
	onFiltersChange,
	onPageSizeChange,
	onColumnVisibilityChange,
	onResetFilters,
}: FilterToolbarProps) {
	const hasActiveFilters =
		filters.search.trim() !== "" ||
		Object.values(filters.multiSelect).some((values) => values.length > 0) ||
		Object.values(filters.dateRanges).some(
			(range) => range.from !== "" || range.to !== "",
		);

	function handleFilterToggle(filterKey: string, value: string) {
		const currentValues = filters.multiSelect[filterKey] ?? [];

		onFiltersChange({
			...filters,
			multiSelect: {
				...filters.multiSelect,
				[filterKey]: toggleFilterValue(currentValues, value),
			},
		});
	}

	return (
		<section className="filters-panel" aria-label="Data grid filters">
			<div className="filter-fields">
				<label className="filter-control search-control">
					<span>Search</span>
					<input
						type="search"
						value={filters.search}
						placeholder="Search rows"
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
						}>
						{PAGE_SIZE_OPTIONS.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</label>

				{dateRangeFilters.map((filter) => (
					<DateRangePicker
						key={filter.key}
						label={filter.label}
						value={filter.value}
						onChange={(value) =>
							onFiltersChange({
								...filters,
								dateRanges: {
									...filters.dateRanges,
									[filter.key]: value,
								},
							})
						}
					/>
				))}

				<button
					type="button"
					className="clear-filters-button"
					disabled={!hasActiveFilters}
					onClick={onResetFilters}>
					Reset
				</button>
			</div>

			<div className="filter-menus">
				{multiSelectFilters.map((filter) => (
					<MultiSelectDropdown
						key={filter.key}
						label={filter.label}
						options={filter.options}
						values={filter.values}
						onToggle={(value) => handleFilterToggle(filter.key, value)}
					/>
				))}

				<ColumnsDropdown
					columns={columnOptions}
					onColumnVisibilityChange={onColumnVisibilityChange}
				/>
			</div>
		</section>
	);
}

type DateRangePickerProps = {
	label: string;
	value: {
		from: string;
		to: string;
	};
	onChange: (value: { from: string; to: string }) => void;
};

function DateRangePicker({ label, value, onChange }: DateRangePickerProps) {
	return (
		<>
			<label className="filter-control">
				<span>{label} from</span>
				<input
					type="date"
					value={value.from}
					onChange={(event) => onChange({ ...value, from: event.target.value })}
				/>
			</label>
			<label className="filter-control">
				<span>{label} to</span>
				<input
					type="date"
					value={value.to}
					onChange={(event) => onChange({ ...value, to: event.target.value })}
				/>
			</label>
		</>
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
					sideOffset={6}>
					{options.map((option) => (
						<DropdownMenu.CheckboxItem
							key={option}
							className="filter-option"
							checked={values.includes(option)}
							onCheckedChange={() => onToggle(option)}
							onSelect={(event) => event.preventDefault()}>
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
	const visibleCount = hideableColumns.filter(
		(column) => column.isVisible,
	).length;

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
					sideOffset={6}>
					{hideableColumns.map((column) => (
						<DropdownMenu.CheckboxItem
							key={column.id}
							className="filter-option"
							checked={column.isVisible}
							onCheckedChange={(checked) =>
								onColumnVisibilityChange(column.id, checked === true)
							}
							onSelect={(event) => event.preventDefault()}>
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
