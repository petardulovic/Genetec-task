import type { TimelineDayGroup } from "@/components/Timeline/Timeline.types";
import type { Event } from "@/types/event";

const dayLabelFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric",
});

function getDayKey(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

export function groupEventsByDay(events: Event[]): TimelineDayGroup[] {
	const groups = new Map<string, TimelineDayGroup>();

	for (const event of events) {
		const eventDate = new Date(event.date);
		const dayDate = new Date(
			eventDate.getFullYear(),
			eventDate.getMonth(),
			eventDate.getDate(),
		);
		const key = getDayKey(dayDate);
		const group = groups.get(key);

		if (group) {
			group.events.push(event);
			continue;
		}

		groups.set(key, {
			key,
			label: dayLabelFormatter.format(dayDate),
			date: dayDate,
			events: [event],
		});
	}

	return Array.from(groups.values())
		.sort((firstGroup, secondGroup) => {
			return firstGroup.date.getTime() - secondGroup.date.getTime();
		})
		.map((group) => ({
			...group,
			events: [...group.events].sort((firstEvent, secondEvent) => {
				return (
					new Date(firstEvent.date).getTime() -
					new Date(secondEvent.date).getTime()
				);
			}),
		}));
}
