import { generateMockEvents } from "@/utils/mockDataGenerator";
import { useState } from "react";

export function EventDashboardPage() {
	const [events] = useState(() => generateMockEvents(200));

	return (
		<main>
			<h1>Event Dashboard</h1>

			<p>Total events: {events.length}</p>
		</main>
	);
}
