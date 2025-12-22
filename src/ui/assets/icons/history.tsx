import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Icon } from "@/types";

export const HistoryIcon = ({ size = 24, color = "black", ...rest }: Icon) => {
	return (
		<MaterialCommunityIcons
			name="history"
			size={size}
			color={color}
			{...rest}
		/>
	);
};
