import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { useListsStore } from "@/ui/stores/Lists.store";

export const ListDetailView = () => {
	const { id } = useLocalSearchParams();
	const { loadList, currentList } = useListsStore((state) => state);

	useEffect(() => {
		loadList(id as string);
	}, [id, loadList]);

	return (
		<View>
			<Text>Lista {currentList?.name}</Text>
			{currentList && (
				<Text>
					Criado em {currentList.createdAt.toDateString()} às{" "}
					{currentList.createdAt.toTimeString()}
				</Text>
			)}
			{currentList && <Text>Criado por {currentList.createdBy}</Text>}
		</View>
	);
};
