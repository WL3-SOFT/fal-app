import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useTheme } from "@/ui/hooks";
import { useListDetails } from "./ListDetail.hook";
import { createListDetailStyles } from "./ListDetail.styles";
import { Header } from "./subcomponents";

export const ListDetailView = () => {
	const { theme } = useTheme();
	const { id } = useLocalSearchParams();
	const { list, headerSubTitle } = useListDetails(id as string);
	const styles = createListDetailStyles(theme);

	return (
		<View style={styles.container}>
			<Header
				listName={list?.name || ""}
				headerSubTitle={headerSubTitle}
			/>
		</View>
	);
};
