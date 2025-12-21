import { Text } from "react-native";
import { useTheme } from "@/ui/hooks";
import { createHeadStyles } from "./Head.styles";
import type { HeadProps } from "./Head.types";

export const Head = ({ title, color, type, id }: HeadProps) => {
	const { theme } = useTheme();
	const style = createHeadStyles(theme, color);

	return (
		<Text
			testID={id}
			style={style[type || "h1"]}>
			{title}
		</Text>
	);
};
