import { StyleSheet } from "react-native";
import type { Theme } from "@/presentation/themes";
import type { DisplayCardProps, DisplayCardSize } from "./DisplayCard.types";

export const createDisplayCardStyles = (
	theme: Theme,
	props: DisplayCardProps,
) => {
	const dimensions: Record<
		DisplayCardSize,
		{
			flex: number;
			width: number;
		}
	> = {
		small: {
			flex: 1,
			width: theme.spacing.lg3,
		},
		medium: {
			flex: 2,
			width: theme.spacing.lg3 * 2,
		},
		large: {
			flex: 3,
			// biome-ignore lint/style/noMagicNumbers: Não é um número mágico
			width: theme.spacing.lg3 * 3,
		},
	};
	return StyleSheet.create({
		container: {
			backgroundColor: "silver",
			borderRadius: theme.borderRadius.sm,
			padding: theme.spacing.sm3,
			...(props.isFlex && { flex: dimensions[props.size || "small"].flex }),
			...(!props.isFlex && {
				minWidth: dimensions[props.size || "small"].width,
			}),
			minHeight: theme.spacing.lg3,
		},
	});
};
