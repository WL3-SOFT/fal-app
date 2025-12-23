import { StyleSheet } from "react-native";
import type { Theme } from "@/ui/theme";

export const createMyListsStyles = (theme: Theme, hasContent: boolean) =>
	StyleSheet.create({
		container: {
			flexDirection: "column",
			backgroundColor: theme.colors.background,
			paddingTop: theme.spacing.sm6,
			gap: theme.spacing.sm1,
			paddingHorizontal: theme.spacing.sm3,
			...(!hasContent && { height: "100%" }),
		},
		headerContainer: {
			marginBottom: theme.spacing.sm1,
		},
		text: {
			fontFamily: theme.typography.fontFamily.primary,
		},
	});
