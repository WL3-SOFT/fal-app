import { StyleSheet } from "react-native";
import type { Theme } from "@/types";

export const createCreateListStyles = (theme: Theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			gap: theme.spacing.sm5,
		},
		groupTitle: {},
		title: {
			fontSize: theme.typography.fontSize.lg3,
			fontWeight: theme.typography.fontWeight.medium,
			lineHeight: theme.typography.lineHeight.lg2,
			color: theme.colors.primary,
			maxWidth: theme.spacing.xxl1,
		},
		input: {
			borderBottomColor: theme.colors.primary,
			borderBottomWidth: theme.spacing.xs2,
			width: theme.spacing.xxl1,
			backgroundColor: theme.colors.input.background,
			padding: theme.spacing.sm1,
			borderRadius: theme.spacing.xs4,
		},
	});
};
