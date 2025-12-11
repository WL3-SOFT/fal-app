import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Icon } from "@/types";

export const Home = ({ size = 24, color = "black", ...rest }: Icon) => {
	return (
		<MaterialCommunityIcons
			name="home-variant"
			size={size}
			color={color}
			{...rest}
		/>
	);
};
