import { Image } from "expo-image";
import { DisplayCard } from "@/presentation/components";
import { useTheme } from "@/presentation/hooks";
import { colors } from "@/presentation/themes/tokens";

export const MyLists = () => {
	const { theme } = useTheme();
	return (
		<DisplayCard
			onPress={() => {
				console.log("Ir para as Minhas listas");
			}}
			style={{
				width: theme.spacing.lg3,
				height: theme.spacing.lg3,
				padding: theme.spacing.none,
				backgroundColor: "#F1C52C",
			}}>
			<Image
				source={require("@/presentation/assets/images/minhas-listas.png")}
				contentFit="contain"
				style={{
					flex: 1,
				}}
				priority="high"
			/>
		</DisplayCard>
	);
};
