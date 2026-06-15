export const EVENT_STATUSES = ["draft", "scheduled", "completed", "cancelled"];

export const EVENT_PRIORITIES = ["low", "medium", "high", "critical"];

export const EVENT_CATEGORIES = [
	"meeting",
	"maintenance",
	"security",
	"system",
	"incident",
];

export type EventStatus = (typeof EVENT_STATUSES)[number];

export type EventPriority = (typeof EVENT_PRIORITIES)[number];

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type Event = {
	id: string;
	title: string;
	date: string;
	category: EventCategory;
	status: EventStatus;
	priority: EventPriority;
	description?: string;
};

export type CreateEventPayload = Omit<Event, "id">;
