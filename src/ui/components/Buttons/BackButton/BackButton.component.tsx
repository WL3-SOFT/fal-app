import { Pressable, Text } from "react-native";
import { ArrowLeft } from "@/ui/assets/icons";
import { useTheme } from "@/ui/hooks";
import { createBackButtonStyles } from "./BackButton.styles";
import type { BackButtonProps } from "./BackButton.types";

export const BackButton = ({
	onPress,
	id,
	title = "voltar",
}: BackButtonProps) => {
	const { theme } = useTheme();
	const styles = createBackButtonStyles(theme);

	return (
		<Pressable
			testID={id}
			id={id}
			style={styles.container}
			onPress={onPress}>
			<ArrowLeft size={theme.spacing.sm3} />
			<Text style={styles.text}>{title}</Text>
		</Pressable>
	);
};
