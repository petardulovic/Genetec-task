import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Controller,
	type SubmitErrorHandler,
	useForm,
} from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import {
	EVENT_CATEGORIES,
	EVENT_PRIORITIES,
	EVENT_STATUSES,
	type CreateEventPayload,
	type Event,
	type EventCategory,
	type EventPriority,
	type EventStatus,
} from "@/types/event";
import "./AddOrEditEventForm.css";

type AddOrEditEventFormProps = {
	open: boolean;
	event?: Event | null;
	onCancel: () => void;
	onSave: (payload: CreateEventPayload, eventId?: string) => void;
};

const eventFormSchema = z.object({
	title: z.string().trim().min(1, "Title is required."),
	date: z
		.string()
		.min(1, "Enter a valid date.")
		.refine((value) => !Number.isNaN(new Date(value).getTime()), {
			message: "Enter a valid date.",
		}),
	category: z.enum(EVENT_CATEGORIES),
	status: z.enum(EVENT_STATUSES),
	priority: z.enum(EVENT_PRIORITIES),
	description: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const DEFAULT_VALUES: EventFormValues = {
	title: "",
	date: "",
	category: "meeting",
	status: "draft",
	priority: "medium",
	description: "",
};

function formatDateTimeInputValue(date: string) {
	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		return "";
	}

	const offsetDate = new Date(
		parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60_000,
	);

	return offsetDate.toISOString().slice(0, 16);
}

function getInitialValues(event?: Event | null): EventFormValues {
	if (!event) {
		return DEFAULT_VALUES;
	}

	return {
		title: event.title,
		date: formatDateTimeInputValue(event.date),
		category: event.category,
		status: event.status,
		priority: event.priority,
		description: event.description ?? "",
	};
}

export function AddOrEditEventForm({
	open,
	event,
	onCancel,
	onSave,
}: AddOrEditEventFormProps) {
	const isEditing = event !== null && event !== undefined;
	const {
		control,
		handleSubmit,
		reset,
		setFocus,
		formState: { errors },
	} = useForm<EventFormValues>({
		defaultValues: getInitialValues(event),
		resolver: zodResolver(eventFormSchema),
	});

	useEffect(() => {
		reset(getInitialValues(event));
	}, [event, reset]);

	function handleInvalidSubmit(
		nextErrors: Parameters<SubmitErrorHandler<EventFormValues>>[0],
	) {
		if (nextErrors.title) {
			setFocus("title");
			return;
		}

		if (nextErrors.date) {
			setFocus("date");
		}
	}

	function handleValidSubmit(values: EventFormValues) {
		onSave(
			{
				title: values.title.trim(),
				date: new Date(values.date).toISOString(),
				category: values.category,
				status: values.status,
				priority: values.priority,
				description: (values.description ?? "").trim() || undefined,
			},
			event?.id,
		);
	}

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
			<Dialog.Portal>
				<Dialog.Overlay className="event-form-overlay" />
				<Dialog.Content className="event-form-modal">
					<form
						className="event-form"
						onSubmit={handleSubmit(handleValidSubmit, handleInvalidSubmit)}>
						<header className="event-form-heading">
							<Dialog.Title className="event-form-title">
								{isEditing ? "Edit event" : "Add event"}
							</Dialog.Title>
							<Dialog.Description className="event-form-description">
								{isEditing
									? "Update the event details and save your changes."
									: "Create a new event for the schedule."}
							</Dialog.Description>
						</header>

						<label className="event-form-field">
							<span>Title</span>
							<Controller
								name="title"
								control={control}
								render={({ field }) => (
									<input
										{...field}
										type="text"
										aria-invalid={errors.title ? "true" : undefined}
										aria-describedby={
											errors.title ? "title-error" : undefined
										}
									/>
								)}
							/>
							{errors.title ? (
								<span className="field-error" id="title-error">
									{errors.title.message}
								</span>
							) : null}
						</label>

						<label className="event-form-field">
							<span>Date</span>
							<Controller
								name="date"
								control={control}
								render={({ field }) => (
									<input
										{...field}
										type="datetime-local"
										aria-invalid={errors.date ? "true" : undefined}
										aria-describedby={errors.date ? "date-error" : undefined}
									/>
								)}
							/>
							{errors.date ? (
								<span className="field-error" id="date-error">
									{errors.date.message}
								</span>
							) : null}
						</label>

						<div className="event-form-grid">
							<label className="event-form-field">
								<span>Category</span>
								<Controller
									name="category"
									control={control}
									render={({ field }) => (
										<select {...field}>
											{EVENT_CATEGORIES.map((category: EventCategory) => (
												<option key={category} value={category}>
													{category}
												</option>
											))}
										</select>
									)}
								/>
							</label>

							<label className="event-form-field">
								<span>Status</span>
								<Controller
									name="status"
									control={control}
									render={({ field }) => (
										<select {...field}>
											{EVENT_STATUSES.map((status: EventStatus) => (
												<option key={status} value={status}>
													{status}
												</option>
											))}
										</select>
									)}
								/>
							</label>

							<label className="event-form-field">
								<span>Priority</span>
								<Controller
									name="priority"
									control={control}
									render={({ field }) => (
										<select {...field}>
											{EVENT_PRIORITIES.map((priority: EventPriority) => (
												<option key={priority} value={priority}>
													{priority}
												</option>
											))}
										</select>
									)}
								/>
							</label>
						</div>

						<label className="event-form-field">
							<span>Description</span>
							<Controller
								name="description"
								control={control}
								render={({ field }) => <textarea {...field} rows={4} />}
							/>
						</label>

						<footer className="event-form-actions">
							<button
								type="button"
								className="secondary-button"
								onClick={onCancel}>
								Cancel
							</button>
							<button type="submit" className="primary-button">
								Save event
							</button>
						</footer>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
