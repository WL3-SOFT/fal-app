import type { StyleProp, ViewStyle } from "react-native";

export type DisplayCardSize = "small" | "medium" | "large";

export type DisplayCardProps = {
	size?: DisplayCardSize;
	onPress?: () => void;
	children: React.ReactNode;
	isFlex?: boolean;
	style?: StyleProp<ViewStyle>;
};
