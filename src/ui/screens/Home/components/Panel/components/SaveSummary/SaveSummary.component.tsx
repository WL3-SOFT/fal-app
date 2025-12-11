import { useMemo } from "react";
import { Text, View } from "react-native";
import { DisplayCard } from "@/ui/components";
import { useTheme } from "@/ui/hooks";
import { createSaveSummaryStyles } from "./SaveSummary.styles";

export const SaveSummary = () => {
	const { theme } = useTheme();

	const styles = useMemo(() => createSaveSummaryStyles(theme), [theme]);
	return (
		<DisplayCard
			size="large"
			isFlex={true}
			onPress={() => {
				console.log("Ir para economia");
			}}
			backgroundColor={theme.colors.primary}
			style={{
				height: theme.spacing.lg3,
			}}>
			<View style={styles.content}>
				<Text style={styles.title}>Você já economizou</Text>
				<Text style={styles.price}>R$ 100,00</Text>
				<Text style={styles.timeCount}>em 27 dias</Text>
			</View>
		</DisplayCard>
	);
};
