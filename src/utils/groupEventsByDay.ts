import type {
	TimelineGroup,
	TimelineItem,
} from "@/components/Timeline/Timeline.types";

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

export function groupEventsByDay<T>(
	items: TimelineItem<T>[],
): TimelineGroup<T>[] {
	const groups = new Map<string, TimelineGroup<T>>();

	for (const item of items) {
		const eventDate = item.date;
		const dayDate = new Date(
			eventDate.getFullYear(),
			eventDate.getMonth(),
			eventDate.getDate(),
		);
		const key = getDayKey(dayDate);
		const group = groups.get(key);

		if (group) {
			group.items.push(item);
			continue;
		}

		groups.set(key, {
			key,
			label: dayLabelFormatter.format(dayDate),
			sortDate: dayDate,
			items: [item],
		});
	}

	return Array.from(groups.values())
		.sort((firstGroup, secondGroup) => {
			return firstGroup.sortDate.getTime() - secondGroup.sortDate.getTime();
		})
		.map((group) => ({
			...group,
			items: [...group.items].sort((firstItem, secondItem) => {
				return firstItem.date.getTime() - secondItem.date.getTime();
			}),
		}));
}
