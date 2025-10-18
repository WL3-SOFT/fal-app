import { DisplayCard } from "@/presentation/components";

export const SaveSummary = () => {
	return (
		<DisplayCard
			size="large"
			isFlex={true}
			onPress={() => {
				console.log("First Card Pressed");
			}}
		/>
	);
};
