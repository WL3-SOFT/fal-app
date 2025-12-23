import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListCard } from "@/ui/components";
import { useTheme } from "@/ui/hooks";
import { Header, NoList } from "./components";
import { createMyListsStyles } from "./Lists.styles";
import { useListsPage } from "./Lists.viewModel";

export const ListsView = () => {
	const { theme } = useTheme();

	const { data, indicatorText, onPressListCard, onCreateList, hasContent } =
		useListsPage();
	const styles = createMyListsStyles(theme, hasContent);

	return (
		<SafeAreaView>
			<FlatList
				contentContainerStyle={styles.container}
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
						shouldHighlightAddButton={!hasContent}
					/>
				}
				ListHeaderComponentStyle={styles.headerContainer}
				ListEmptyComponent={<NoList />}
			/>
		</SafeAreaView>
	);
};
