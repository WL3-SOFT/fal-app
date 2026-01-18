import { StyleSheet } from "react-native";
import type { Theme } from "@/types";

const underActionOpacity = 0.7;

export const createCustomButtonStyles = (
	theme: Theme,
	isUnderAction: boolean,
) => {
	return StyleSheet.create({
		container: {
			paddingHorizontal: theme.spacing.sm1,
			borderRadius: theme.spacing.xs4,
			alignItems: "center",
			justifyContent: "center",
			maxHeight: theme.spacing.sm7,
			opacity: isUnderAction ? underActionOpacity : 1,
			flex: 1,
		},
		primary: {
			backgroundColor: theme.colors.button.default.background,
		},
		secondary: {
			backgroundColor: theme.colors.secondary,
		},
		text: {
			backgroundColor: "transparent",
		},
		disabled: {
			// filter: "grayscale(1)",
			backgroundColor: theme.colors.button.disabled.background,
		},
		label: {
			fontSize: theme.typography.fontSize.md1,
			fontWeight: theme.typography.fontWeight.medium,
		},
		labelPrimary: {
			color: theme.colors.button.default.text,
		},
		labelSecondary: {
			color: theme.colors.textSecondary,
		},
		labelText: {
			color: theme.colors.primary,
		},
		small: {
			width: theme.spacing.xl1,
		},
		medium: {
			width: theme.spacing.xl3,
		},
		large: {
			width: theme.spacing.xxl1,
		},
	});
};
