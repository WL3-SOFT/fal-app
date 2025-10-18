import { StyleSheet } from "react-native";
import type { Theme } from "@/presentation/themes";

export const createHomeStyles = (theme: Theme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: "column",
			backgroundColor: theme.colors.background,
			paddingHorizontal: theme.spacing.sm3,
		},
		text: {
			fontFamily: theme.typography.fontFamily.regular,
		},
	});
