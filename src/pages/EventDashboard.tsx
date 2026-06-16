import { DataGrid } from "@/components/DataGrid/DataGrid";
import { getEventColumns } from "@/data/eventColumns";
import { generateMockEvents } from "@/utils/mockDataGenerator";
import { useState, type ReactNode } from "react";
import "./EventDashboard.css";

import {
	CalendarIcon,
	ClockIcon,
	ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

export function EventDashboardPage() {
	const [events] = useState(() => generateMockEvents(200));
	const scheduledEvents = events.filter(
		(event) => event.status === "scheduled",
	).length;
	const criticalEvents = events.filter(
		(event) => event.priority === "critical",
	).length;

	const columns = getEventColumns({
		onEdit: (event) => console.log("Edit:", event),
		onRemove: (event) => console.log("Remove:", event),
	});

	return (
		<main className="events-page">
			<header className="product-bar">
				<span>Genetec</span>
			</header>

			<section className="page-heading">
				<div>
					<h1>Event Management Dashboard</h1>
					<p>Manage and monitor scheduled system events</p>
				</div>

				<button type="button" className="create-event-button">
					<span>+</span>
					New Event
				</button>
			</section>

			<section className="event-summary" aria-label="Event summary">
				<StatCard
					color="blue"
					icon={<CalendarIcon />}
					label="Total Events"
					value={events.length}
					description="All time"
				/>
				<StatCard
					color="green"
					icon={<ClockIcon />}
					label="Scheduled"
					value={scheduledEvents}
					description="Upcoming events"
				/>
				<StatCard
					color="red"
					icon={<ExclamationTriangleIcon />}
					label="Critical Priority"
					value={criticalEvents}
					description="High attention events"
				/>
			</section>

			<DataGrid data={events} columns={columns} />
		</main>
	);
}

type StatCardProps = {
	color: "blue" | "green" | "red";
	icon: ReactNode;
	label: string;
	value: number;
	description: string;
};

function StatCard({ color, icon, label, value, description }: StatCardProps) {
	return (
		<article className="summary-card">
			<div className={`summary-symbol ${color}-summary`}>{icon}</div>
			<div>
				<h2>{label}</h2>
				<strong>{value}</strong>
				<p>{description}</p>
			</div>
		</article>
	);
}
