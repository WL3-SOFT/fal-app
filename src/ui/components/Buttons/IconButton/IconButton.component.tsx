import { Pressable } from "react-native";
import type { IconButtonProps } from "./IconButton.types";

export const IconButton = ({
	onPress,
	id,
	icon,
	size = 24,
}: IconButtonProps) => {
	const pressedOpacity = 0.7;
	return (
		<Pressable
			testID={id}
			id={id}
			style={({ pressed }) => ({
				width: size,
				height: size,
				opacity: pressed ? pressedOpacity : 1,
			})}
			onPress={onPress}>
			{icon}
		</Pressable>
	);
};
