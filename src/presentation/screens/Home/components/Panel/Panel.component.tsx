import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { DisplayCard } from "@/presentation/components";
import { useTheme } from "@/presentation/hooks";
import { MyLists, SaveSummary } from "./components";
import { createPanelStyles } from "./Panel.styles";

const options = [
	{ id: "1", title: "Mais vendidos" },
	{ id: "2", title: "Ofertas" },
	{ id: "3", title: "Promoções" },
	{ id: "4", title: "Categorias" },
];

export const Panels = () => {
	const { theme } = useTheme();
	const styles = useMemo(() => {
		return createPanelStyles(theme);
	}, [theme]);

	return (
		<View style={styles.container}>
			<View style={styles.firstSection}>
				<SaveSummary />
				<MyLists />
			</View>
			<FlatList
				renderItem={({ item }) => (
					<DisplayCard
						size="small"
						onPress={() => {
							console.log(item.title);
						}}
						style={{ marginRight: theme.spacing.sm2 }}>
						<Text>{item.title}</Text>
					</DisplayCard>
				)}
				horizontal={true}
				data={options}
				keyExtractor={(item) => item.id}></FlatList>
		</View>
	);
};
