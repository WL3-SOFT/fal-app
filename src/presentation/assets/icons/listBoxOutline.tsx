import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Icon } from "@/presentation/types";

export const ListBoxOutline = ({
	size = 24,
	color = "black",
	...rest
}: Icon) => {
	return (
		<MaterialCommunityIcons
			name="list-box-outline"
			size={size}
			color={color}
			{...rest}
		/>
	);
};
