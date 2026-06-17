import {
	EVENT_CATEGORIES,
	EVENT_PRIORITIES,
	EVENT_STATUSES,
	type Event,
} from "../types/event";

const eventTitles = [
	"Security Camera Offline",
	"Door Access Maintenance",
	"System Health Check",
	"Incident Review",
	"Weekly Operations Meeting",
	"Network Upgrade",
	"Access Control Audit",
	"Video Archive Cleanup",
	"Emergency Drill",
	"System Configuration Update",
];

const eventDescriptions = [
	"Routine operational event created for demo purposes.",
	"Requires review from the operations team.",
	"Automatically generated mock event.",
	"Scheduled maintenance activity.",
	"Follow-up required after completion.",
];

function getRandomItem<T>(items: readonly T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

function getRandomDateTime(): string {
	const today = new Date();
	const daysOffset = Math.floor(Math.random() * 30) - 10;
	const hour = Math.floor(Math.random() * 24);
	const minute = Math.floor(Math.random() * 12) * 5;

	const date = new Date(today);
	date.setDate(today.getDate() + daysOffset);
	date.setHours(hour, minute, 0, 0);

	return date.toISOString();
}

export function generateMockEvents(count: number): Event[] {
	return Array.from({ length: count }, (_, index) => ({
		id: crypto.randomUUID(),
		title: `${getRandomItem(eventTitles)} #${index + 1}`,
		date: getRandomDateTime(),
		category: getRandomItem(EVENT_CATEGORIES),
		status: getRandomItem(EVENT_STATUSES),
		priority: getRandomItem(EVENT_PRIORITIES),
		description: getRandomItem(eventDescriptions),
	}));
}
