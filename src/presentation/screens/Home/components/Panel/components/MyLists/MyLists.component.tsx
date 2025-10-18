import { Text } from "react-native";
import { DisplayCard } from "@/presentation/components";

export const MyLists = () => {
	return (
		<DisplayCard
			isFlex={true}
			size="small"
			onPress={() => {
				console.log("Minhas listas");
			}}>
			<Text>Minhas listas</Text>
		</DisplayCard>
	);
};
