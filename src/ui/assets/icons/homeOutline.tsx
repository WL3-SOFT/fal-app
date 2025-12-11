import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Icon } from "@/types";

export const HomeOutline = ({ size = 24, color = "black", ...rest }: Icon) => {
	return (
		<MaterialCommunityIcons
			name="home-variant-outline"
			size={size}
			color={color}
			{...rest}
		/>
	);
};
