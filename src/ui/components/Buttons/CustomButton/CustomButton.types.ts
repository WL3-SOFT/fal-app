import type { PressableProps } from "react-native";

export interface CustomButtonProps {
	title: string;
	onPress: () => void;
	id?: string;
	variant?: "primary" | "secondary" | "text";
	disabled?: boolean;
	size?: "small" | "medium" | "large";
	accessibilityLabel?: string;
	pressableProps?: Omit<PressableProps, "onPress" | "disabled">;
	isUnderAction?: boolean;
	underActionTitle?: string;
}
