import { DataGrid } from "@/components/DataGrid/DataGrid";
import { AddOrEditEventForm } from "@/components/EventForm/AddOrEditEventForm";
import { EventTimeline } from "@/components/EventTimeline/EventTimeline";
import { Toast } from "@/components/Toast/Toast";
import { getEventColumns } from "@/data/eventColumns";
import { generateMockEvents } from "@/utils/mockDataGenerator";
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import type { CreateEventPayload, Event } from "@/types/event";
import "./EventDashboard.css";

import {
	CalendarIcon,
	ClockIcon,
	ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

export function EventDashboardPage() {
	const [events, setEvents] = useState(() => generateMockEvents(200));
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [isEventFormOpen, setIsEventFormOpen] = useState(false);
	const [isGridLoading, setIsGridLoading] = useState(true);
	const [gridError, setGridError] = useState<string | null>(null);
	const [toast, setToast] = useState<{ id: string; message: string } | null>(
		null,
	);
	const scheduledEvents = events.filter(
		(event) => event.status === "scheduled",
	).length;
	const criticalEvents = events.filter(
		(event) => event.priority === "critical",
	).length;

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			setIsGridLoading(false);
		}, 900);

		return () => window.clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		if (!toast) {
			return;
		}

		const timeoutId = window.setTimeout(() => {
			setToast(null);
		}, 3000);

		return () => window.clearTimeout(timeoutId);
	}, [toast]);

	const showToast = useCallback((message: string) => {
		setToast({
			id: crypto.randomUUID(),
			message,
		});
	}, []);

	const handleCreateEvent = useCallback(() => {
		setSelectedEvent(null);
		setIsEventFormOpen(true);
	}, []);

	const handleEditEvent = useCallback((event: Event) => {
		setSelectedEvent(event);
		setIsEventFormOpen(true);
	}, []);

	const handleRemoveEvent = useCallback((event: Event) => {
		setEvents((currentEvents) =>
			currentEvents.filter((currentEvent) => currentEvent.id !== event.id),
		);
	}, []);

	const handleCancelEventForm = useCallback(() => {
		setIsEventFormOpen(false);
		setSelectedEvent(null);
	}, []);

	const handleSaveEvent = useCallback(
		(payload: CreateEventPayload, eventId?: string) => {
			if (eventId) {
				setEvents((currentEvents) =>
					currentEvents.map((event) =>
						event.id === eventId ? { ...event, ...payload } : event,
					),
				);
				showToast("Event updated successfully");
			} else {
				setEvents((currentEvents) => [
					{
						id: crypto.randomUUID(),
						...payload,
					},
					...currentEvents,
				]);
				showToast("Event created successfully");
			}

			setIsEventFormOpen(false);
			setSelectedEvent(null);
		},
		[showToast],
	);

	const columns = useMemo(
		() =>
			getEventColumns({
				onEdit: handleEditEvent,
				onRemove: handleRemoveEvent,
			}),
		[handleEditEvent, handleRemoveEvent],
	);

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

				<div className="page-actions">
					<button
						type="button"
						className="create-event-button"
						onClick={handleCreateEvent}>
						<span>+</span>
						New Event
					</button>
					<button
						type="button"
						className="demo-state-button"
						onClick={() =>
							setGridError((currentError) =>
								currentError
									? null
									: "Demo error: events could not be loaded.",
							)
						}>
						{gridError ? "Clear error" : "Simulate error"}
					</button>
				</div>
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

			<DataGrid
				data={events}
				columns={columns}
				loading={isGridLoading}
				error={gridError}
			/>

			<EventTimeline events={events} />
			{isEventFormOpen ? (
				<AddOrEditEventForm
					key={selectedEvent?.id ?? "new-event"}
					open={isEventFormOpen}
					event={selectedEvent}
					onCancel={handleCancelEventForm}
					onSave={handleSaveEvent}
				/>
			) : null}

			<Toast key={toast?.id} message={toast?.message ?? ""} />
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
