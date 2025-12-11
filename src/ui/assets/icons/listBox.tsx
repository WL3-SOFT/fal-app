import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Icon } from "@/types";

export const ListBox = ({ size = 24, color = "black", ...rest }: Icon) => {
	return (
		<MaterialCommunityIcons
			name="list-box"
			size={size}
			color={color}
			{...rest}
		/>
	);
};
