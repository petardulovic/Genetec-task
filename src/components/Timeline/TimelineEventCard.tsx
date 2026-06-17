import type { TimelineEventCardProps } from "./Timeline.types";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
	hour: "2-digit",
	minute: "2-digit",
});

function formatLabel(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

function createPill(value: string) {
	return <span className={`pill ${value}-pill`}>{formatLabel(value)}</span>;
}

export function TimelineEventCard({
	event,
	groupLabel,
	groupLength,
	groupIndex,
	itemIndex,
	isFocused,
	onEventFocus,
	onEventKeyDown,
	setEventRef,
}: TimelineEventCardProps) {
	return (
		<button
			type="button"
			ref={(element) => setEventRef(event.id, element)}
			className="timeline-event-button"
			tabIndex={isFocused ? 0 : -1}
			onClick={() => onEventFocus(groupIndex, itemIndex)}
			onFocus={() => onEventFocus(groupIndex, itemIndex)}
			onKeyDown={onEventKeyDown}
			aria-label={`${groupLabel}, event ${itemIndex + 1} of ${groupLength}: ${event.title}`}>
			<span className="timeline-event-time">
				{timeFormatter.format(new Date(event.date))}
			</span>
			<span className="timeline-event-body">
				<span className="timeline-event-title">{event.title}</span>
				<span className="timeline-event-meta">
					{createPill(event.category)}
					{createPill(event.status)}
					{createPill(event.priority)}
				</span>
			</span>
		</button>
	);
}
