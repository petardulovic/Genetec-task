import type { KeyboardEventHandler, ReactNode } from "react";

export type TimelineProps<T> = {
	items: T[];
	getId: (item: T) => string;
	getDate: (item: T) => string | Date;
	getGroupKey: (item: T, date: Date) => string;
	getGroupLabel: (item: T, date: Date) => string;
	getItemAriaLabel: (item: T, context: TimelineItemContext) => string;
	renderItemTitle: (props: TimelineCardRenderProps<T>) => ReactNode;
	renderItemBody: (props: TimelineCardRenderProps<T>) => ReactNode;
	emptyTitle?: string;
	itemLabel?: string;
};

export type TimelineView = "week" | "month";

export type TimelineItemContext = {
	groupLabel: string;
	groupLength: number;
	itemIndex: number;
};

export type TimelineItem<T> = {
	id: string;
	ariaLabel: string;
	date: Date;
	item: T;
};

export type TimelineCardRenderProps<T> = {
	timelineItem: TimelineItem<T>;
	item: T;
	date: Date;
};

export type TimelineGroup<T> = {
	key: string;
	label: string;
	sortDate: Date;
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
	group: TimelineGroup<T>;
	groupIndex: number;
	focusedGroupIndex: number;
	focusedItemIndex: number;
	onEventFocus: (groupIndex: number, itemIndex: number) => void;
	onEventKeyDown: KeyboardEventHandler<HTMLButtonElement>;
	setEventRef: (eventId: string, element: HTMLButtonElement | null) => void;
	renderItemTitle: (props: TimelineCardRenderProps<T>) => ReactNode;
	renderItemBody: (props: TimelineCardRenderProps<T>) => ReactNode;
};

export type TimelineCardProps<T> = {
	timelineItem: TimelineItem<T>;
	groupIndex: number;
	itemIndex: number;
	isFocused: boolean;
	onEventFocus: (groupIndex: number, itemIndex: number) => void;
	onEventKeyDown: KeyboardEventHandler<HTMLButtonElement>;
	setEventRef: (eventId: string, element: HTMLButtonElement | null) => void;
	renderItemTitle: (props: TimelineCardRenderProps<T>) => ReactNode;
	renderItemBody: (props: TimelineCardRenderProps<T>) => ReactNode;
};

export type TimelineCardContentProps<T> = {
	timelineItem: TimelineItem<T>;
	renderItemTitle: (props: TimelineCardRenderProps<T>) => ReactNode;
	renderItemBody: (props: TimelineCardRenderProps<T>) => ReactNode;
};
