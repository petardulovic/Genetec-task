import { groupEventsByDay } from "@/utils/groupEventsByDay";
import {
	useEffect,
	useMemo,
	useRef,
	useState,
	type KeyboardEvent,
} from "react";
import { TimelineControls } from "./TimelineControls";
import { TimelineGroup } from "./TimelineGroup";
import type { TimelineItem, TimelineProps, TimelineView } from "./Timeline.types";
import "./Timeline.css";

const monthFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
});

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

function getWeekStart(date: Date) {
	const weekStart = new Date(date);
	const day = weekStart.getDay();
	const daysFromMonday = day === 0 ? 6 : day - 1;

	weekStart.setDate(weekStart.getDate() - daysFromMonday);
	weekStart.setHours(0, 0, 0, 0);

	return weekStart;
}

function getMonthStart(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getTimelinePeriod(date: Date, view: TimelineView) {
	const startDate = view === "week" ? getWeekStart(date) : getMonthStart(date);
	const endDate = new Date(startDate);

	if (view === "week") {
		endDate.setDate(startDate.getDate() + 7);
	} else {
		endDate.setMonth(startDate.getMonth() + 1);
	}

	return { startDate, endDate };
}

function getOffsetDate(date: Date, view: TimelineView, direction: -1 | 1) {
	const nextDate = new Date(date);

	if (view === "week") {
		nextDate.setDate(date.getDate() + direction * 7);
		return nextDate;
	}

	nextDate.setMonth(date.getMonth() + direction);
	return nextDate;
}

function sortItemsByDate<T>(items: TimelineItem<T>[]) {
	return [...items].sort((firstItem, secondItem) => {
		return firstItem.date.getTime() - secondItem.date.getTime();
	});
}

function formatPeriodLabel(startDate: Date, endDate: Date, view: TimelineView) {
	if (view === "month") {
		return monthFormatter.format(startDate);
	}

	const inclusiveEndDate = new Date(endDate);
	inclusiveEndDate.setDate(endDate.getDate() - 1);

	return `${shortDateFormatter.format(startDate)} - ${fullDateFormatter.format(inclusiveEndDate)}`;
}

function hasEventsInPeriod(
	items: TimelineItem<unknown>[],
	date: Date,
	view: TimelineView,
) {
	const period = getTimelinePeriod(date, view);
	const startTime = period.startDate.getTime();
	const endTime = period.endDate.getTime();

	return items.some((item) => {
		const eventTime = item.date.getTime();

		return eventTime >= startTime && eventTime < endTime;
	});
}

function normalizeTimelineDate(value: string | Date) {
	return value instanceof Date ? value : new Date(value);
}

export function Timeline<T>({
	items,
	getId,
	getDate,
	getTitle,
	renderPill,
	emptyTitle,
	itemLabel = "events",
}: TimelineProps<T>) {
	const [timelineView, setTimelineView] = useState<TimelineView>("week");
	const [visibleDate, setVisibleDate] = useState(() => new Date());
	const timelineItems = useMemo(
		() =>
			items.map((item) => ({
				id: getId(item),
				title: getTitle(item),
				date: normalizeTimelineDate(getDate(item)),
				item,
			})),
		[items, getDate, getId, getTitle],
	);
	const period = useMemo(
		() => getTimelinePeriod(visibleDate, timelineView),
		[visibleDate, timelineView],
	);
	const periodLabel = useMemo(
		() => formatPeriodLabel(period.startDate, period.endDate, timelineView),
		[period, timelineView],
	);
	const visibleEvents = useMemo(() => {
		const startTime = period.startDate.getTime();
		const endTime = period.endDate.getTime();

		return sortItemsByDate(timelineItems)
			.filter((item) => {
				const eventTime = item.date.getTime();

				return eventTime >= startTime && eventTime < endTime;
			});
	}, [period, timelineItems]);
	const isPreviousPeriodDisabled = useMemo(() => {
		return !hasEventsInPeriod(
			timelineItems,
			getOffsetDate(visibleDate, timelineView, -1),
			timelineView,
		);
	}, [timelineItems, timelineView, visibleDate]);
	const isNextPeriodDisabled = useMemo(() => {
		return !hasEventsInPeriod(
			timelineItems,
			getOffsetDate(visibleDate, timelineView, 1),
			timelineView,
		);
	}, [timelineItems, timelineView, visibleDate]);
	const groups = useMemo(() => groupEventsByDay(visibleEvents), [visibleEvents]);
	const periodSummary =
		groups.length === 0
			? `No ${itemLabel} for ${periodLabel}.`
			: `${visibleEvents.length} ${itemLabel} for ${periodLabel}`;
	const emptyStateTitle = emptyTitle ?? `No ${itemLabel} scheduled`;
	const [storedGroupIndex, setStoredGroupIndex] = useState(0);
	const [storedItemIndex, setStoredItemIndex] = useState(0);
	const eventRefs = useRef(new Map<string, HTMLButtonElement>());
	const shouldMoveFocusRef = useRef(false);
	const focusedGroupIndex =
		groups.length > 0 ? Math.min(storedGroupIndex, groups.length - 1) : 0;
	const focusedGroup = groups[focusedGroupIndex];
	const focusedItemIndex = focusedGroup
		? Math.min(storedItemIndex, focusedGroup.items.length - 1)
		: 0;

	useEffect(() => {
		if (!shouldMoveFocusRef.current) {
			return;
		}

		const focusedEvent = groups[focusedGroupIndex]?.items[focusedItemIndex];

		if (!focusedEvent) {
			return;
		}

		const focusedElement = eventRefs.current.get(focusedEvent.id);
		focusedElement?.focus();
		focusedElement?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "nearest",
		});
		shouldMoveFocusRef.current = false;
	}, [focusedGroupIndex, focusedItemIndex, groups]);

	function updateFocusedEvent(groupIndex: number, itemIndex: number) {
		const group = groups[groupIndex];
		const event = group?.items[itemIndex];

		if (!group || !event) {
			return;
		}

		setStoredGroupIndex(groupIndex);
		setStoredItemIndex(itemIndex);
	}

	function handleEventKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
		const currentGroup = groups[focusedGroupIndex];

		if (!currentGroup) {
			return;
		}

		if (event.key === "ArrowRight") {
			if (focusedItemIndex >= currentGroup.items.length - 1) {
				return;
			}

			event.preventDefault();
			shouldMoveFocusRef.current = true;
			updateFocusedEvent(focusedGroupIndex, focusedItemIndex + 1);
			return;
		}

		if (event.key === "ArrowLeft") {
			if (focusedItemIndex === 0) {
				return;
			}

			event.preventDefault();
			shouldMoveFocusRef.current = true;
			updateFocusedEvent(focusedGroupIndex, focusedItemIndex - 1);
			return;
		}

		if (event.key === "ArrowDown") {
			if (focusedGroupIndex >= groups.length - 1) {
				return;
			}

			const nextGroup = groups[focusedGroupIndex + 1];
			const nextItemIndex = Math.min(
				focusedItemIndex,
				nextGroup.items.length - 1,
			);

			event.preventDefault();
			shouldMoveFocusRef.current = true;
			updateFocusedEvent(focusedGroupIndex + 1, nextItemIndex);
			return;
		}

		if (event.key === "ArrowUp") {
			if (focusedGroupIndex === 0) {
				return;
			}

			const previousGroup = groups[focusedGroupIndex - 1];
			const previousItemIndex = Math.min(
				focusedItemIndex,
				previousGroup.items.length - 1,
			);

			event.preventDefault();
			shouldMoveFocusRef.current = true;
			updateFocusedEvent(focusedGroupIndex - 1, previousItemIndex);
		}
	}

	function handlePreviousPeriod() {
		setVisibleDate((currentDate) => getOffsetDate(currentDate, timelineView, -1));
	}

	function handleNextPeriod() {
		setVisibleDate((currentDate) => getOffsetDate(currentDate, timelineView, 1));
	}

	function handleViewChange(nextView: TimelineView) {
		setTimelineView(nextView);
		setVisibleDate(new Date());
		setStoredGroupIndex(0);
		setStoredItemIndex(0);
	}

	function setEventRef(eventId: string, element: HTMLButtonElement | null) {
		if (element) {
			eventRefs.current.set(eventId, element);
			return;
		}

		eventRefs.current.delete(eventId);
	}

	const timelineControls = (
		<TimelineControls
			isNextDisabled={isNextPeriodDisabled}
			isPreviousDisabled={isPreviousPeriodDisabled}
			periodLabel={periodLabel}
			view={timelineView}
			onNextPeriod={handleNextPeriod}
			onPreviousPeriod={handlePreviousPeriod}
			onViewChange={handleViewChange}
		/>
	);

	if (groups.length === 0) {
		return (
			<section className="timeline-panel" aria-labelledby="timeline-heading">
				<div className="timeline-heading">
					<div>
						<h2 id="timeline-heading">Timeline</h2>
						<p aria-live="polite" aria-atomic="true">
							{periodSummary}
						</p>
					</div>
					{timelineControls}
				</div>
				<div className="timeline-empty-state">
					<h3>{emptyStateTitle}</h3>
					<p>Use the arrows to browse another {timelineView}.</p>
				</div>
			</section>
		);
	}

	return (
		<section className="timeline-panel" aria-labelledby="timeline-heading">
			<div className="timeline-heading">
				<div>
					<h2 id="timeline-heading">Timeline</h2>
					<p aria-live="polite" aria-atomic="true">
						{periodSummary}
					</p>
				</div>
				{timelineControls}
			</div>

			<div className="timeline-groups">
				{groups.map((group, groupIndex) => (
					<TimelineGroup
						key={group.key}
						group={group}
						groupIndex={groupIndex}
						focusedGroupIndex={focusedGroupIndex}
						focusedItemIndex={focusedItemIndex}
						onEventFocus={updateFocusedEvent}
						onEventKeyDown={handleEventKeyDown}
						setEventRef={setEventRef}
						renderPill={renderPill}
					/>
				))}
			</div>
		</section>
	);
}
