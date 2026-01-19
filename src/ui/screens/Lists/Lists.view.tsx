import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListCard } from "@/ui/components";
import { useTheme } from "@/ui/hooks";
import { Header, NoList } from "./subcomponents";
import { useLists } from "./Lists.hook";
import { createMyListsStyles } from "./Lists.styles";

export const ListsView = () => {
	const { theme } = useTheme();

	const {
		lists,
		hasContent,
		navigateToDetails,
		quantityText,
		navigateToCreate,
	} = useLists();
	const styles = createMyListsStyles(theme, hasContent);

	return (
		<SafeAreaView>
			<FlatList
				contentContainerStyle={styles.container}
				data={lists}
				renderItem={({ item }) => (
					<ListCard
						id={item.id}
						title={item.name}
						itemsQuantity={item.productCount}
						lowestPrice={item.usedTimes}
						onPress={() => navigateToDetails(item.id)}
					/>
				)}
				keyExtractor={(item) => item.id}
				ListHeaderComponent={
					<Header
						indicatorText={quantityText}
						onCreateList={navigateToCreate}
						shouldHighlightAddButton={!hasContent}
					/>
				}
				ListHeaderComponentStyle={styles.headerContainer}
				ListEmptyComponent={<NoList />}
			/>
		</SafeAreaView>
	);
};
