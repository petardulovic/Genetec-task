import type { TimelineEventCardProps } from "./Timeline.types";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
	hour: "2-digit",
	minute: "2-digit",
});

export function TimelineEventCard<T>({
	timelineItem,
	groupLabel,
	groupLength,
	groupIndex,
	itemIndex,
	isFocused,
	onEventFocus,
	onEventKeyDown,
	setEventRef,
	renderPill,
}: TimelineEventCardProps<T>) {
	return (
		<button
			type="button"
			ref={(element) => setEventRef(timelineItem.id, element)}
			className="timeline-event-button"
			tabIndex={isFocused ? 0 : -1}
			onClick={() => onEventFocus(groupIndex, itemIndex)}
			onFocus={() => onEventFocus(groupIndex, itemIndex)}
			onKeyDown={onEventKeyDown}
			aria-label={`${groupLabel}, event ${itemIndex + 1} of ${groupLength}: ${timelineItem.title}`}>
			<span className="timeline-event-time">
				{timeFormatter.format(timelineItem.date)}
			</span>
			<span className="timeline-event-body">
				<span className="timeline-event-title">{timelineItem.title}</span>
				{renderPill ? (
					<span className="timeline-event-meta">
						{renderPill(timelineItem.item)}
					</span>
				) : null}
			</span>
		</button>
	);
}
