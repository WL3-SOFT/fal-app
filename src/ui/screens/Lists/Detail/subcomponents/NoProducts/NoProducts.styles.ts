import { StyleSheet } from "react-native";
import type { Theme } from "@/types";

export const createNoProductsStyles = (theme: Theme) => {
	return StyleSheet.create({
		container: {
			height: "85%",
			justifyContent: "center",
			alignItems: "center",
			gap: theme.spacing.xs2,
		},
		image: {
			width: theme.spacing.xxl1,
			height: theme.spacing.xxl1,
			filter: "opacity(0.5)",
		},
		text: {
			fontSize: theme.typography.fontSize.md3,
			fontWeight: theme.typography.fontWeight.semiBold,
			color: theme.colors.fallback.text,
			width: theme.spacing.xl3,
			textAlign: "center",
		},
	});
};
