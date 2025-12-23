import type { PressableProps } from "react-native";

export interface TextButtonProps {
	title: string;
	onPress: () => void;
	id?: string;
	variant?: "primary" | "secondary" | "text";
	disabled?: boolean;
	accessibilityLabel?: string;
	pressableProps?: Omit<PressableProps, "onPress" | "disabled">;
}
