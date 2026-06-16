import "./NoResultsFound.css";

export function NoResultsFoundPage() {
	return (
		<section className="empty-results">
			<h1>No results found</h1>
			<p>
				No events found for the specified query. Please try changing the search
				criteria.
			</p>
		</section>
	);
}
