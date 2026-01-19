import { StyleSheet } from "react-native";
import type { Theme } from "@/ui/themes";

export const createListDetailStyles = (theme: Theme, hasContent: boolean) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
			paddingHorizontal: theme.spacing.sm3,
		},
		content: {
			flex: 1,
			justifyContent: hasContent ? "center" : "flex-start",
		},
	});
