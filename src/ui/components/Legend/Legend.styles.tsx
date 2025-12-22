import { StyleSheet } from "react-native";
import type { Theme } from "@/types";

export const createLegendStyles = (theme: Theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			gap: theme.spacing.xs2,
			alignItems: "center",
		},
		text: {
			fontSize: theme.typography.fontSize.sm3,
			color: theme.colors.legend.text,
		},
	});
};
