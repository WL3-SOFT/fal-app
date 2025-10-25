import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
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

	if (!onPress) {
		return (
			<View
				style={StyleSheet.compose(styles.container, props.style)}
				testID="menu-card">
				<View style={styles.content}>{children}</View>
			</View>
		);
	}

	return (
		<TouchableOpacity
			style={StyleSheet.compose(styles.container, props.style)}
			testID="menu-card"
			onPress={onPress}>
			<View style={styles.content}>{children}</View>
		</TouchableOpacity>
	);
};
