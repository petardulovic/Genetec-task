import "./Loader.css";

export function Loader() {
	return (
		<div className="loading-state" role="status">
			<div className="spinner-stage">
				<div className="spinner-ring" />
			</div>
			<div className="loading-message">Loading, please wait...</div>
		</div>
	);
}
