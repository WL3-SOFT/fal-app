import { StyleSheet } from "react-native";
import type { Theme } from "@/types";

export const createTextButtonStyles = (theme: Theme) => {
	return StyleSheet.create({
		container: {
			paddingVertical: theme.spacing.xs2,
			paddingHorizontal: theme.spacing.sm1,
			borderRadius: 4,
			alignItems: "center",
			justifyContent: "center",
			minHeight: 36,
		},
		primary: {
			backgroundColor: theme.colors.primary,
		},
		secondary: {
			backgroundColor: theme.colors.secondary,
		},
		text: {
			backgroundColor: "transparent",
		},
		disabled: {
			opacity: 0.5,
		},
		label: {
			fontSize: theme.typography.fontSize.md2,
			fontWeight: theme.typography.fontWeight.medium,
		},
		labelPrimary: {
			color: theme.colors.text,
		},
		labelSecondary: {
			color: theme.colors.textSecondary,
		},
		labelText: {
			color: theme.colors.primary,
		},
	});
};
