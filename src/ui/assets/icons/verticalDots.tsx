import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Icon } from "@/types";

export const VerticalDots = ({ size = 24, color = "black", ...rest }: Icon) => {
	return (
		<MaterialCommunityIcons
			name="dots-vertical"
			size={size}
			color={color}
			{...rest}
		/>
	);
};
