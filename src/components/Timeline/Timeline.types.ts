import type { KeyboardEventHandler, ReactNode } from "react";

export type TimelineProps<T> = {
	items: T[];
	getId: (item: T) => string;
	getDate: (item: T) => string | Date;
	getTitle: (item: T) => string;
	renderPill?: (item: T) => ReactNode;
	emptyTitle?: string;
	itemLabel?: string;
};

export type TimelineView = "week" | "month";

export type TimelineItem<T> = {
	id: string;
	title: string;
	date: Date;
	item: T;
};

export type TimelineDayGroup<T> = {
	key: string;
	label: string;
	date: Date;
	items: TimelineItem<T>[];
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

export type TimelineGroupProps<T> = {
	group: TimelineDayGroup<T>;
	groupIndex: number;
	focusedGroupIndex: number;
	focusedItemIndex: number;
	onEventFocus: (groupIndex: number, itemIndex: number) => void;
	onEventKeyDown: KeyboardEventHandler<HTMLButtonElement>;
	setEventRef: (eventId: string, element: HTMLButtonElement | null) => void;
	renderPill?: (item: T) => ReactNode;
};

export type TimelineEventCardProps<T> = {
	timelineItem: TimelineItem<T>;
	groupLabel: string;
	groupLength: number;
	groupIndex: number;
	itemIndex: number;
	isFocused: boolean;
	onEventFocus: (groupIndex: number, itemIndex: number) => void;
	onEventKeyDown: KeyboardEventHandler<HTMLButtonElement>;
	setEventRef: (eventId: string, element: HTMLButtonElement | null) => void;
	renderPill?: (item: T) => ReactNode;
};
