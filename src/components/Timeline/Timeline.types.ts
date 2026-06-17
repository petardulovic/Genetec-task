import type { Event } from "@/types/event";
import type { KeyboardEventHandler } from "react";

export type TimelineProps = {
	events: Event[];
};

export type TimelineView = "week" | "month";

export type TimelineDayGroup = {
	key: string;
	label: string;
	date: Date;
	events: Event[];
};

export type TimelineControlsProps = {
	isNextDisabled: boolean;
	isPreviousDisabled: boolean;
	periodLabel: string;
	view: TimelineView;
	onNextPeriod: () => void;
	onPreviousPeriod: () => void;
	onViewChange: (view: TimelineView) => void;
};

export type TimelineGroupProps = {
	group: TimelineDayGroup;
	groupIndex: number;
	focusedGroupIndex: number;
	focusedItemIndex: number;
	onEventFocus: (groupIndex: number, itemIndex: number) => void;
	onEventKeyDown: KeyboardEventHandler<HTMLButtonElement>;
	setEventRef: (eventId: string, element: HTMLButtonElement | null) => void;
};

export type TimelineEventCardProps = {
	event: Event;
	groupLabel: string;
	groupLength: number;
	groupIndex: number;
	itemIndex: number;
	isFocused: boolean;
	onEventFocus: (groupIndex: number, itemIndex: number) => void;
	onEventKeyDown: KeyboardEventHandler<HTMLButtonElement>;
	setEventRef: (eventId: string, element: HTMLButtonElement | null) => void;
};
