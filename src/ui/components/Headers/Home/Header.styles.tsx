import { StyleSheet } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";
import type { Theme } from "@/ui/theme";

export const createHeaderStyles = (theme: Theme, insets: EdgeInsets) =>
	StyleSheet.create({
		container: {
			marginTop: insets.top,
			marginRight: insets.right,
			marginLeft: insets.left,
			paddingVertical: theme.spacing.sm3,
			paddingHorizontal: theme.spacing.sm3,
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			backgroundColor: theme.colors.background,
		},
	});
