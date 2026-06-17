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
import type { TimelineProps, TimelineView } from "./Timeline.types";
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

function sortEventsByDate(events: TimelineProps["events"]) {
	return [...events].sort((firstEvent, secondEvent) => {
		return (
			new Date(firstEvent.date).getTime() -
			new Date(secondEvent.date).getTime()
		);
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

function createAnnouncement(
	groupLabel: string,
	eventTitle: string,
	itemIndex: number,
	groupLength: number,
) {
	return `Focused ${groupLabel}, event ${itemIndex + 1} of ${groupLength}: ${eventTitle}.`;
}

function hasEventsInPeriod(
	events: TimelineProps["events"],
	date: Date,
	view: TimelineView,
) {
	const period = getTimelinePeriod(date, view);
	const startTime = period.startDate.getTime();
	const endTime = period.endDate.getTime();

	return events.some((event) => {
		const eventTime = new Date(event.date).getTime();

		return eventTime >= startTime && eventTime < endTime;
	});
}

export function Timeline({ events }: TimelineProps) {
	const [timelineView, setTimelineView] = useState<TimelineView>("week");
	const [visibleDate, setVisibleDate] = useState(() => new Date());
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

		return sortEventsByDate(events)
			.filter((event) => {
				const eventTime = new Date(event.date).getTime();

				return eventTime >= startTime && eventTime < endTime;
			});
	}, [events, period]);
	const isPreviousPeriodDisabled = useMemo(() => {
		return !hasEventsInPeriod(
			events,
			getOffsetDate(visibleDate, timelineView, -1),
			timelineView,
		);
	}, [events, timelineView, visibleDate]);
	const isNextPeriodDisabled = useMemo(() => {
		return !hasEventsInPeriod(
			events,
			getOffsetDate(visibleDate, timelineView, 1),
			timelineView,
		);
	}, [events, timelineView, visibleDate]);
	const groups = useMemo(() => groupEventsByDay(visibleEvents), [visibleEvents]);
	const [storedGroupIndex, setStoredGroupIndex] = useState(0);
	const [storedItemIndex, setStoredItemIndex] = useState(0);
	const [announcement, setAnnouncement] = useState("");
	const eventRefs = useRef(new Map<string, HTMLButtonElement>());
	const shouldMoveFocusRef = useRef(false);
	const focusedGroupIndex =
		groups.length > 0 ? Math.min(storedGroupIndex, groups.length - 1) : 0;
	const focusedGroup = groups[focusedGroupIndex];
	const focusedItemIndex = focusedGroup
		? Math.min(storedItemIndex, focusedGroup.events.length - 1)
		: 0;

	useEffect(() => {
		if (!shouldMoveFocusRef.current) {
			return;
		}

		const focusedEvent = groups[focusedGroupIndex]?.events[focusedItemIndex];

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
		const event = group?.events[itemIndex];

		if (!group || !event) {
			return;
		}

		setStoredGroupIndex(groupIndex);
		setStoredItemIndex(itemIndex);
		setAnnouncement(
			createAnnouncement(
				group.label,
				event.title,
				itemIndex,
				group.events.length,
			),
		);
	}

	function handleEventKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
		const currentGroup = groups[focusedGroupIndex];

		if (!currentGroup) {
			return;
		}

		if (event.key === "ArrowRight") {
			if (focusedItemIndex >= currentGroup.events.length - 1) {
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
				nextGroup.events.length - 1,
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
				previousGroup.events.length - 1,
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
						<p>No events for {periodLabel}.</p>
					</div>
					{timelineControls}
				</div>
				<div className="timeline-empty-state">
					<h3>No events scheduled</h3>
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
					<p>
						{visibleEvents.length} events for {periodLabel}
					</p>
				</div>
				{timelineControls}
			</div>

			<div className="timeline-sr-only" aria-live="polite">
				{announcement}
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
					/>
				))}
			</div>
		</section>
	);
}
