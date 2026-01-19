import { Image } from "expo-image";
import { Text, View } from "react-native";
import { useTheme } from "@/ui/hooks";
import { createNoListStyles } from "./NoList.styles";

export const NoList = () => {
	const { theme } = useTheme();
	const styles = createNoListStyles(theme);
	return (
		<View style={styles.container}>
			<Image
				priority="high"
				source={require("#assets/images/doodles/withoutListDoodle.png")}
				style={styles.image}
				contentFit="contain"
				testID="fallback-image"
			/>
			<View>
				<View style={styles.groupTextContainer}>
					<Text
						testID="fallback-text-1"
						style={{ ...styles.text, ...styles.neutral }}>
						Tire sua lista do{" "}
					</Text>
					<Text
						testID="fallback-text-2"
						style={{ ...styles.text, ...styles.neutral, ...styles.textAccent }}>
						papel.
					</Text>
				</View>
				<View style={styles.groupTextContainer}>
					<Text
						testID="fallback-text-3"
						style={{ ...styles.text, ...styles.cta }}>
						Crie sua{" "}
					</Text>
					<Text
						testID="fallback-text-4"
						style={{ ...styles.text, ...styles.cta, ...styles.neutral }}>
						primeira{" "}
					</Text>
					<Text
						testID="fallback-text-5"
						style={{ ...styles.text, ...styles.cta }}>
						lista!
					</Text>
				</View>
			</View>
		</View>
	);
};
