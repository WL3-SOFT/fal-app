import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Icon } from "@/types";

export const Sun = ({ size = 24, color = "black", ...rest }: Icon) => {
	return (
		<MaterialCommunityIcons
			name="brightness-5"
			size={size}
			color={color}
			{...rest}
		/>
	);
};
