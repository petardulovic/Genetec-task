import type { Event } from "@/types/event";

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
});

const dayLabelFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric",
});

export function getEventTimelineGroupKey(_event: Event, date: Date) {
	return dayKeyFormatter.format(date);
}

export function getEventTimelineGroupLabel(_event: Event, date: Date) {
	return dayLabelFormatter.format(date);
}

export function getEventTimelineAriaLabel(
	event: Event,
	context: { groupLabel: string; groupLength: number; itemIndex: number },
) {
	return `${context.groupLabel}, event ${context.itemIndex + 1} of ${context.groupLength}: ${event.title}`;
}
