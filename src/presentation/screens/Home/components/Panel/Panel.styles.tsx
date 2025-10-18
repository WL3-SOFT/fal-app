import { StyleSheet } from "react-native";
import type { Theme } from "@/presentation/themes";

export const createPanelStyles = (theme: Theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: "column",
			gap: theme.spacing.sm2,
		},
		firstSection: {
			flexDirection: "row",
			height: theme.spacing.lg3,
			gap: theme.spacing.sm2,
		},
	});
};
