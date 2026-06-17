import { TimelineEventCard } from "./TimelineEventCard";
import type { TimelineGroupProps } from "./Timeline.types";

export function TimelineGroup({
	group,
	groupIndex,
	focusedGroupIndex,
	focusedItemIndex,
	onEventFocus,
	onEventKeyDown,
	setEventRef,
}: TimelineGroupProps) {
	return (
		<section
			className="timeline-group"
			aria-labelledby={`timeline-group-${group.key}`}>
			<h3 id={`timeline-group-${group.key}`}>{group.label}</h3>
			<ol className="timeline-events">
				{group.events.map((timelineEvent, itemIndex) => {
					const isFocused =
						groupIndex === focusedGroupIndex && itemIndex === focusedItemIndex;

					return (
						<li key={timelineEvent.id} className="timeline-event">
							<TimelineEventCard
								event={timelineEvent}
								groupLabel={group.label}
								groupLength={group.events.length}
								groupIndex={groupIndex}
								itemIndex={itemIndex}
								isFocused={isFocused}
								onEventFocus={onEventFocus}
								onEventKeyDown={onEventKeyDown}
								setEventRef={setEventRef}
							/>
						</li>
					);
				})}
			</ol>
		</section>
	);
}
