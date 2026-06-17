import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import type {
	TimelineControlsProps,
	TimelineView,
} from "./Timeline.types";

const viewOptions: { label: string; value: TimelineView }[] = [
	{ label: "Week", value: "week" },
	{ label: "Month", value: "month" },
];

export function TimelineControls({
	isNextDisabled,
	isPreviousDisabled,
	periodLabel,
	view,
	onNextPeriod,
	onPreviousPeriod,
	onViewChange,
}: TimelineControlsProps) {
	return (
		<div className="timeline-controls" aria-label="Timeline controls">
			<div className="timeline-period-controls">
				<button
					type="button"
					className="timeline-period-button"
					onClick={onPreviousPeriod}
					disabled={isPreviousDisabled}
					aria-label={`Previous ${view}`}>
					<ChevronLeftIcon />
				</button>
				<span className="timeline-period-label">{periodLabel}</span>
				<button
					type="button"
					className="timeline-period-button"
					onClick={onNextPeriod}
					disabled={isNextDisabled}
					aria-label={`Next ${view}`}>
					<ChevronRightIcon />
				</button>
			</div>

			<label className="timeline-view-control">
				<span>Show</span>
				<select
					value={view}
					onChange={(event) =>
						onViewChange(event.target.value as TimelineView)
					}>
					{viewOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</label>
		</div>
	);
}
