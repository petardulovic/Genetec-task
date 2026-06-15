export type TimelineItem = {
	id: string;
	title: string;
	date: string;
	description?: string;
};

export type TimelineGroup = {
	label: string;
	items: TimelineItem[];
};
