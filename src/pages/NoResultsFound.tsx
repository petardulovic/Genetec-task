import "./NoResultsFound.css";

type NoResultsFoundPageProps = {
	title?: string;
	message?: string;
};

export function NoResultsFoundPage({
	title = "No results found",
	message = "No results found for the specified query. Please try changing the search criteria.",
}: NoResultsFoundPageProps) {
	return (
		<section className="empty-results">
			<h3>{title}</h3>
			<p>{message}</p>
		</section>
	);
}
