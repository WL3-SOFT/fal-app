import { useMemo } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { useTheme } from "@/presentation/hooks";
import { createDisplayCardStyles } from "./DisplayCard.styles";
import type { DisplayCardProps } from "./DisplayCard.types";

export const DisplayCard = (props: DisplayCardProps) => {
	const { children, onPress } = props;
	const { theme } = useTheme();
	const styles = useMemo(
		() => createDisplayCardStyles(theme, props),
		[theme, props],
	);

	return (
		<TouchableHighlight
			style={StyleSheet.compose(styles.container, props.style)}
			testID="menu-card"
			onPress={onPress}>
			<View>{children}</View>
		</TouchableHighlight>
	);
};
