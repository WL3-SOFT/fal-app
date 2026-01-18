import { Pressable, Text } from "react-native";
import { useTheme } from "@/ui/hooks";
import { createCustomButtonStyles } from "./CustomButton.styles";
import type { CustomButtonProps } from "./CustomButton.types";

const pressedOpacity = 0.7;

export const CustomButton = ({
	title,
	onPress,
	id,
	variant = "text",
	disabled = false,
	accessibilityLabel,
	pressableProps,
	isUnderAction = false,
	underActionTitle = "carregando...",
	size = "medium",
}: CustomButtonProps) => {
	const { theme } = useTheme();
	const styles = createCustomButtonStyles(theme, isUnderAction);

	const containerStyle = [
		styles.container,
		variant === "primary" && styles.primary,
		variant === "secondary" && styles.secondary,
		size === "small" && styles.small,
		size === "medium" && styles.medium,
		size === "large" && styles.large,
		variant === "text" && styles.text,
		disabled && styles.disabled,
	];

	const labelStyle = [
		styles.label,
		variant === "primary" && styles.labelPrimary,
		variant === "secondary" && styles.labelSecondary,
		variant === "text" && styles.labelText,
	];

	return (
		<Pressable
			testID={id}
			id={id}
			style={({ pressed }) => [
				...containerStyle,
				{ opacity: pressed ? pressedOpacity : 1 },
			]}
			onPress={onPress}
			disabled={isUnderAction || disabled}
			accessibilityLabel={accessibilityLabel || title}
			accessibilityRole="button"
			{...pressableProps}>
			<Text style={labelStyle}>{isUnderAction ? underActionTitle : title}</Text>
		</Pressable>
	);
};
