import "./NoResultsFound.css";

type ErrorPageProps = {
	message?: string;
	title?: string;
};

export function ErrorPage({
	message = "Something went wrong. Please try again.",
	title = "Unable to load data",
}: ErrorPageProps) {
	return (
		<section className="empty-results" role="alert">
			<h3>{title}</h3>
			<p>{message}</p>
		</section>
	);
}
