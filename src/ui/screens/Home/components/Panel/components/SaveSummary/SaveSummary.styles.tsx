import { StyleSheet } from "react-native";
import type { Theme } from "@/types";

export const createSaveSummaryStyles = (theme: Theme) => {
	return StyleSheet.create({
		content: {
			flexDirection: "column",
			flex: 1,
			justifyContent: "center",
			gap: theme.spacing.xs2,
			paddingHorizontal: theme.spacing.xs4,
		},
		title: {
			fontSize: theme.typography.fontSize.md1,
			fontWeight: "bold",
			color: theme.colors.saveSummary.title,
		},
		price: {
			fontSize: theme.typography.fontSize.xl1,
			fontWeight: "bold",
			color: theme.colors.saveSummary.price,
		},
		timeCount: {
			fontSize: theme.typography.fontSize.md1,
			fontWeight: theme.typography.fontWeight.bold,
			color: theme.colors.saveSummary.count,
			textAlign: "right",
		},
	});
};
