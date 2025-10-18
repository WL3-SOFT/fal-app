import { StyleSheet } from "react-native";
import type { Theme } from "@/presentation/themes";

export const createAvatarStyles = (theme: Theme) =>
	StyleSheet.create({
		container: {
			width: theme.spacing.sm7,
			height: theme.spacing.sm7,
			borderRadius: theme.borderRadius.full,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "green",
		},

		text: {
			color: "white",
		},
	});
