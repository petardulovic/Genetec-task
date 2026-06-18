import type { TimelineCardContentProps } from "./Timeline.types";

export function TimelineCardContent<T>({
	timelineItem,
	renderItemTitle,
	renderItemBody,
}: TimelineCardContentProps<T>) {
	const renderProps = {
		timelineItem,
		item: timelineItem.item,
		date: timelineItem.date,
	};

	return (
		<>
			<span className="timeline-event-title">{renderItemTitle(renderProps)}</span>
			<span className="timeline-event-body">{renderItemBody(renderProps)}</span>
		</>
	);
}
