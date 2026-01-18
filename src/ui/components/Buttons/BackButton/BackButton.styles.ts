import { StyleSheet } from "react-native";
import type { Theme } from "@/types";

export const createBackButtonStyles = (theme: Theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: theme.spacing.xs4,
		},
		text: {
			backgroundColor: "transparent",
			fontSize: theme.typography.fontSize.md2,
			fontWeight: theme.typography.fontWeight.regular,
		},
	});
};
