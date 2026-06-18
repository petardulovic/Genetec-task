import { Timeline } from "@/components/Timeline/Timeline";
import type { Event } from "@/types/event";
import {
	EventTimelineCardBody,
	EventTimelineCardTitle,
} from "./EventTimelineCard";
import {
	getEventTimelineAriaLabel,
	getEventTimelineGroupKey,
	getEventTimelineGroupLabel,
} from "./eventTimelineConfig";

type EventTimelineProps = {
	events: Event[];
};

export function EventTimeline({ events }: EventTimelineProps) {
	return (
		<Timeline
			items={events}
			getId={(event) => event.id}
			getDate={(event) => event.date}
			getGroupKey={getEventTimelineGroupKey}
			getGroupLabel={getEventTimelineGroupLabel}
			getItemAriaLabel={getEventTimelineAriaLabel}
			renderItemTitle={({ date }) => <EventTimelineCardTitle date={date} />}
			renderItemBody={({ item }) => <EventTimelineCardBody event={item} />}
		/>
	);
}
