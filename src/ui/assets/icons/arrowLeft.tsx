import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Icon } from "@/types";

export const ArrowLeft = ({ size = 24, color = "black", ...rest }: Icon) => {
	return (
		<MaterialCommunityIcons
			name="arrow-left"
			size={size}
			color={color}
			{...rest}
		/>
	);
};
