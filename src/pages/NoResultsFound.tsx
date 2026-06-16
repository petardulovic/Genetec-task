export function NoResultsFoundPage() {
	return (
		<section style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
			<h1 style={{ marginBottom: "1rem", fontSize: "2rem" }}>
				No results found
			</h1>
			<p
				style={{
					marginBottom: "1.5rem",
					fontSize: "1.05rem",
					color: "#555",
				}}>
				No events found for the specified query. Please try changing the search
				criteria.
			</p>
		</section>
	);
}
