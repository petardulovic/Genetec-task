import "./Pill.css";

type PillProps = {
	group: string;
	value: string;
};

function formatPillLabel(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

export function Pill({ group, value }: PillProps) {
	return (
		<span className={`pill ${group}-pill ${group}-${value}-pill`}>
			{formatPillLabel(value)}
		</span>
	);
}
