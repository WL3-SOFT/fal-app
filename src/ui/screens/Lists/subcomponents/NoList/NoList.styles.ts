import { StyleSheet } from "react-native";
import type { Theme } from "@/types";

export const createNoListStyles = (theme: Theme) => {
	return StyleSheet.create({
		container: {
			height: "85%",
			justifyContent: "center",
			alignItems: "center",
			gap: theme.spacing.sm3,
		},
		image: {
			width: theme.spacing.xl4,
			height: theme.spacing.xl4,
		},
		text: {
			fontSize: theme.typography.fontSize.lg1,
			fontWeight: theme.typography.fontWeight.regular,
		},
		textAccent: {
			fontWeight: theme.typography.fontWeight.light,
			fontStyle: "italic",
		},
		cta: {
			color: theme.colors.primary,
			fontWeight: theme.typography.fontWeight.bold,
		},
		groupTextContainer: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
		},
		neutral: {
			color: theme.colors.fallback.text,
		},
	});
};
