import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Icon } from "@/types";

export const PlusBox = ({
	size = 24,
	color = "black",
	type = "filled",
	...rest
}: Icon & {
	type?: "outline" | "filled";
}) => {
	const iconType = type === "outline" ? "plus-box-outline" : "plus-box";
	return (
		<MaterialCommunityIcons
			name={iconType}
			size={size}
			color={color}
			{...rest}
		/>
	);
};
