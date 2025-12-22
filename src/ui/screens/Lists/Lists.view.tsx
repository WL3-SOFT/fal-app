import { FlatList, View } from "react-native";
import { ListCard } from "@/ui/components";
import { useTheme } from "@/ui/hooks";
import { Header } from "./components";
import { createMyListsStyles } from "./Lists.styles";
import { useListsPage } from "./Lists.viewModel";

export const ListsView = () => {
	const { theme } = useTheme();
	const styles = createMyListsStyles(theme);

	const { data, indicatorText, onPressListCard, onCreateList } = useListsPage();
	return (
		<View style={styles.container}>
			<FlatList
				data={data}
				renderItem={({ item }) => (
					<ListCard
						{...item}
						onPress={() => onPressListCard(item.id)}
					/>
				)}
				keyExtractor={(item) => item.id}
				ListHeaderComponent={
					<Header
						indicatorText={indicatorText}
						onCreateList={onCreateList}
					/>
				}
				ListHeaderComponentStyle={styles.headerContainer}
				contentContainerStyle={{
					paddingHorizontal: theme.spacing.sm3,
				}}
			/>
		</View>
	);
};
