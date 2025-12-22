import { MaterialIcons } from "@expo/vector-icons";
import type { Icon } from "@/types";

export const ListingItemsIcon = ({
	size = 24,
	color = "black",
	...rest
}: Icon) => {
	return (
		<MaterialIcons
			name="splitscreen"
			size={size}
			color={color}
			{...rest}
		/>
	);
};
