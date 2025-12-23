import { Pressable, Text } from "react-native";
import { useTheme } from "@/ui/hooks";
import { createTextButtonStyles } from "./TextButton.styles";
import type { TextButtonProps } from "./TextButton.types";

export const TextButton = ({
	title,
	onPress,
	id,
	variant = "text",
	disabled = false,
	accessibilityLabel,
	pressableProps,
}: TextButtonProps) => {
	const { theme } = useTheme();
	const styles = createTextButtonStyles(theme);

	const pressedOpacity = 0.7;

	const containerStyle = [
		styles.container,
		variant === "primary" && styles.primary,
		variant === "secondary" && styles.secondary,
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
			disabled={disabled}
			accessibilityLabel={accessibilityLabel || title}
			accessibilityRole="button"
			{...pressableProps}>
			<Text style={labelStyle}>{title}</Text>
		</Pressable>
	);
};
