import { useMemo } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/presentation/hooks";
import { createAvatarStyles } from "./Avatar.styles";

export const Avatar = () => {
	const { theme } = useTheme();
	const styles = useMemo(() => createAvatarStyles(theme), [theme]);
	return (
		<View style={styles.container}>
			<Text style={styles.text}>W</Text>
		</View>
	);
};
