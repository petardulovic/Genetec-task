import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { EventDashboardPage } from "./pages/EventDashboard";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<EventDashboardPage />
		</>
	);
}

export default App;
