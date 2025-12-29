import { StyleSheet } from "react-native";
import type { Theme } from "@/ui/themes";

export const createHeadStyles = (theme: Theme, color?: string) => {
	return StyleSheet.create({
		h1: {
			fontSize: theme.typography.fontSize.lg1,
			fontWeight: theme.typography.fontWeight.medium,
			color: color || theme.colors.text,
		},

		h2: {
			fontSize: theme.typography.fontSize.md4,
			fontWeight: theme.typography.fontWeight.medium,
			color: color || theme.colors.text,
		},

		h3: {
			fontSize: theme.typography.fontSize.md3,
			fontWeight: theme.typography.fontWeight.medium,
			color: color || theme.colors.text,
		},

		h4: {
			fontSize: theme.typography.fontSize.md2,
			fontWeight: theme.typography.fontWeight.regular,
			color: color || theme.colors.text,
		},

		h5: {
			fontSize: theme.typography.fontSize.md1,
			fontWeight: theme.typography.fontWeight.regular,
			color: color || theme.colors.text,
		},
	});
};
