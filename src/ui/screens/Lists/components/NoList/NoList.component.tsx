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
			/>
			<View>
				<View style={styles.groupTextContainer}>
					<Text style={{ ...styles.text, ...styles.neutral }}>
						Tire sua lista do{" "}
					</Text>
					<Text
						style={{ ...styles.text, ...styles.neutral, ...styles.textAccent }}>
						papel.
					</Text>
				</View>
				<View style={styles.groupTextContainer}>
					<Text style={{ ...styles.text, ...styles.cta }}>Crie sua </Text>
					<Text style={{ ...styles.text, ...styles.cta, ...styles.neutral }}>
						primeira{" "}
					</Text>
					<Text style={{ ...styles.text, ...styles.cta }}>lista!</Text>
				</View>
			</View>
		</View>
	);
};
