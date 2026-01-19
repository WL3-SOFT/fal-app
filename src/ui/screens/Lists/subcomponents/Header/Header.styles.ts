import { StyleSheet } from "react-native";
import type { Theme } from "@/types";

export const createMyListHeaderStyles = (theme: Theme) => {
	return StyleSheet.create({
		container: {
			gap: theme.spacing.xs2,
			display: "flex",
		},
		subContainer: {
			display: "flex",
			justifyContent: "space-between",
			flexDirection: "row",
			alignItems: "center",
		},
	});
};
