import { TimelineEventCard } from "./TimelineEventCard";
import type { TimelineGroupProps } from "./Timeline.types";

export function TimelineGroup<T>({
	group,
	groupIndex,
	focusedGroupIndex,
	focusedItemIndex,
	onEventFocus,
	onEventKeyDown,
	setEventRef,
	renderPill,
}: TimelineGroupProps<T>) {
	return (
		<section
			className="timeline-group"
			aria-labelledby={`timeline-group-${group.key}`}>
			<h3 id={`timeline-group-${group.key}`}>{group.label}</h3>
			<ol className="timeline-events">
				{group.items.map((timelineItem, itemIndex) => {
					const isFocused =
						groupIndex === focusedGroupIndex && itemIndex === focusedItemIndex;

					return (
						<li key={timelineItem.id} className="timeline-event">
							<TimelineEventCard
								timelineItem={timelineItem}
								groupLabel={group.label}
								groupLength={group.items.length}
								groupIndex={groupIndex}
								itemIndex={itemIndex}
								isFocused={isFocused}
								onEventFocus={onEventFocus}
								onEventKeyDown={onEventKeyDown}
								setEventRef={setEventRef}
								renderPill={renderPill}
							/>
						</li>
					);
				})}
			</ol>
		</section>
	);
}
