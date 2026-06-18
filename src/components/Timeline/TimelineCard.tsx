import { TimelineCardContent } from "./TimelineCardContent";
import type { TimelineCardProps } from "./Timeline.types";

export function TimelineCard<T>({
	timelineItem,
	groupIndex,
	itemIndex,
	isFocused,
	onEventFocus,
	onEventKeyDown,
	setEventRef,
	renderItemTitle,
	renderItemBody,
}: TimelineCardProps<T>) {
	return (
		<button
			type="button"
			ref={(element) => setEventRef(timelineItem.id, element)}
			className="timeline-event-button"
			tabIndex={isFocused ? 0 : -1}
			onClick={() => onEventFocus(groupIndex, itemIndex)}
			onFocus={() => onEventFocus(groupIndex, itemIndex)}
			onKeyDown={onEventKeyDown}
			aria-label={timelineItem.ariaLabel}>
			<TimelineCardContent
				timelineItem={timelineItem}
				renderItemTitle={renderItemTitle}
				renderItemBody={renderItemBody}
			/>
		</button>
	);
}
