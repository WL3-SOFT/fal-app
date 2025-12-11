import { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@/ui/hooks";
import { GreetingMessage, Panels } from "./components";
import { createHomeStyles } from "./Home.styles";

export const HomeView = () => {
	const { theme } = useTheme();
	const styles = useMemo(() => createHomeStyles(theme), [theme]);

	return (
		<View style={styles.container}>
			<GreetingMessage />
			<Panels />
		</View>
	);
};
