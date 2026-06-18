import { Pill } from "@/components/Pill/Pill";
import type { Event } from "@/types/event";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
	hour: "2-digit",
	minute: "2-digit",
});

export function EventTimelineCardTitle({ date }: { date: Date }) {
	return timeFormatter.format(date);
}

export function EventTimelineCardBody({ event }: { event: Event }) {
	return (
		<>
			<span className="timeline-event-name">{event.title}</span>
			<span className="timeline-event-meta">
				<Pill group="category" value={event.category} />
				<Pill group="status" value={event.status} />
				<Pill group="priority" value={event.priority} />
			</span>
		</>
	);
}
