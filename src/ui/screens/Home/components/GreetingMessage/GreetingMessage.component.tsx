import { useMemo } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/ui/hooks";
import { createGreetingMessageStyles } from "./GreetingMessage.styles";

export const GreetingMessage = () => {
	const { theme } = useTheme();
	const styles = useMemo(() => createGreetingMessageStyles(theme), [theme]);

	return (
		<View style={styles.container}>
			<Text style={styles.text} testID="greeting-message">
				Bom dia, <Text style={styles.name}>Aline!</Text>
			</Text>
		</View>
	);
};
