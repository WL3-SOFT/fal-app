import { StyleSheet } from "react-native";
import type { Theme } from "@/types";

export const createListCardStyles = (theme: Theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: theme.spacing.sm2,
			backgroundColor: theme.colors.card,
			paddingHorizontal: theme.spacing.sm2,
			paddingVertical: theme.spacing.sm1,
			maxHeight: theme.spacing.lg3,
			borderRadius: theme.spacing.sm1,
			...theme.shadows.lg,
		},
		subContainer: {
			overflow: "hidden",
			gap: theme.spacing.xs3,
		},
		listInfoContainer: {
			justifyContent: "space-between",
			flex: 2,
		},
		title: {
			fontSize: theme.typography.fontSize.md1,
			color: theme.colors.title,
			height: theme.spacing.md1,
			fontWeight: theme.typography.fontWeight.semiBold,
			wordWrap: "break-word",
			textOverflow: "ellipsis",
			overflow: "hidden",
		},
		info: {
			fontSize: theme.typography.fontSize.sm3,
			color: theme.colors.text,
		},
		priceLabel: {
			fontSize: theme.typography.fontSize.sm2,
			color: theme.colors.highlightPrice,
		},
		price: {
			fontSize: theme.typography.fontSize.md3,
			color: theme.colors.highlightPrice,
			fontWeight: theme.typography.fontWeight.bold,
			lineHeight: theme.typography.fontSize.md3,
		},
		priceInfoContainer: {
			justifyContent: "flex-end",
			textAlign: "right",
			alignItems: "flex-end",
			flex: 1,
			gap: theme.spacing.xs2,
		},
		legendContainer: {
			gap: theme.spacing.xs2,
		},
	});
};
