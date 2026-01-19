import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useTheme } from "@/ui/hooks";
import { useListDetails, useListProducts } from "./ListDetail.hook";
import { createListDetailStyles } from "./ListDetail.styles";
import { Header, NoProducts } from "./subcomponents";

export const ListDetailView = () => {
	const { theme } = useTheme();
	const { id } = useLocalSearchParams();
	const { list, headerSubTitle, loading } = useListDetails(id as string);
	const { hasProducts } = useListProducts(id as string);
	const styles = createListDetailStyles(theme, loading || !hasProducts);

	const shouldShowNoProducts = !hasProducts && !loading;
	const shouldShowProducts = hasProducts && !loading;

	return (
		<View style={styles.container}>
			<Header
				listName={list?.name || ""}
				headerSubTitle={headerSubTitle}
			/>
			<View style={styles.content}>
				{loading && <ActivityIndicator size="large" />}
				{shouldShowNoProducts && <NoProducts />}
				{shouldShowProducts && <Text>Com produtos...</Text>}
			</View>
		</View>
	);
};
