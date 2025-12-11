import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export const ListDetailView = () => {
	const { id } = useLocalSearchParams();
	return (
		<View>
			<Text>List {id}</Text>
		</View>
	);
};
