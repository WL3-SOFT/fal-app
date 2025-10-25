import { StyleSheet } from "react-native";
import type { Theme } from "@/presentation/themes";
import type { DisplayCardProps, DisplayCardSize } from "./DisplayCard.types";

export const createDisplayCardStyles = (
	theme: Theme,
	props: DisplayCardProps,
) => {
	const baseCardSize = theme.spacing.lg2;
	const dimensions: Record<
		DisplayCardSize,
		{
			flex: number;
			width: number;
		}
	> = {
		small: {
			flex: 1,
			width: baseCardSize,
		},
		medium: {
			flex: 2,
			width: baseCardSize * 2,
		},
		large: {
			flex: 3,
			// biome-ignore lint/style/noMagicNumbers: Não é um número mágico
			width: baseCardSize * 3,
		},
	};
	return StyleSheet.create({
		container: {
			...(props.isFlex && { flex: dimensions[props.size || "small"].flex }),
			...(!props.isFlex && {
				width: dimensions[props.size || "small"].width,
			}),
			height: baseCardSize,
			borderRadius: theme.borderRadius.sm,
			backgroundColor: props.backgroundColor || "silver",
			color: props.color || theme.colors.text,
			padding: theme.spacing.sm1,
		},
		content: {
			flex: 1,
		},
	});
};
