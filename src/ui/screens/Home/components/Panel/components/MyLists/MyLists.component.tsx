import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { DisplayCard } from "@/ui/components";
import { useTheme } from "@/ui/hooks";

export const MyLists = () => {
	const { theme } = useTheme();
	const { push } = useRouter();

	const goToMyLists = () => {
		push("/lists");
	};

	return (
		<DisplayCard
			onPress={goToMyLists}
			style={{
				width: theme.spacing.lg3,
				height: theme.spacing.lg3,
				padding: theme.spacing.none,
				backgroundColor: "#F1C52C",
			}}>
			<Image
				source={require("@/ui/assets/images/minhas-listas.png")}
				contentFit="contain"
				style={{
					flex: 1,
				}}
				priority="high"
			/>
		</DisplayCard>
	);
};
