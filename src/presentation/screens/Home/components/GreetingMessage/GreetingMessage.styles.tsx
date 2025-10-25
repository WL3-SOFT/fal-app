import { StyleSheet } from "react-native";
import type { Theme } from "@/presentation/types";

export const createGreetingMessageStyles = (theme: Theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			alignItems: "flex-start",
			paddingVertical: theme.spacing.sm3,
		},
		text: {
			textAlign: "left",
			fontFamily: theme.typography.fontFamily.primary,
			fontSize: theme.typography.fontSize.lg1,
			color: theme.colors.text,
			fontWeight: theme.typography.fontWeight.semiBold,
		},
		name: {
			fontWeight: theme.typography.fontWeight.bold,
		},
	});
};
