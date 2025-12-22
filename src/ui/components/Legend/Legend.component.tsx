import { Text, View } from "react-native";
import { useTheme } from "@/ui/hooks";
import { createLegendStyles } from "./Legend.styles";
import type { LegendProps } from "./Legend.types";

export const Legend = ({ id, text, icon }: LegendProps) => {
	const { theme } = useTheme();
	const styles = createLegendStyles(theme);

	const hasIcon = !!icon;

	return (
		<View
			style={styles.container}
			testID={`${id}-container`}>
			{hasIcon && icon}
			<Text
				testID={`${id}-text`}
				style={styles.text}>
				{text}
			</Text>
		</View>
	);
};
