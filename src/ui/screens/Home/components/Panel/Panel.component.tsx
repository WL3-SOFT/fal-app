import { Image } from "expo-image";
import { useMemo } from "react";
import { FlatList, View } from "react-native";
import { menuOptions } from "@/core/constraints";
import { DisplayCard } from "@/ui/components";
import { useTheme } from "@/ui/hooks";
import { MyLists, SaveSummary } from "./components";
import { createPanelStyles } from "./Panel.styles";

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
						backgroundColor={item.backgroundColor}
						onPress={() => {
							console.log(`Ir para ${item.title}`);
						}}>
						<Image
							source={item.image}
							contentFit="cover"
							style={{
								flex: 1,
							}}
							priority="high"
						/>
					</DisplayCard>
				)}
				horizontal={true}
				data={menuOptions}
				keyExtractor={(item) => item.id}
				ItemSeparatorComponent={() => (
					<View style={{ width: theme.spacing.sm2 }} />
				)}></FlatList>
		</View>
	);
};
