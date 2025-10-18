import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Icon } from "@/presentation/types";

export const Moon = ({ size = 24, color = "black", ...rest }: Icon) => {
	return (
		<MaterialCommunityIcons
			name="brightness-2"
			size={size}
			color={color}
			{...rest}
		/>
	);
};
