import { Image } from "expo-image";
import { Text, View } from "react-native";
import { useTheme } from "@/ui/hooks";
import { createNoProductsStyles } from "./NoProducts.styles";

export const NoProducts = () => {
	const { theme } = useTheme();
	const styles = createNoProductsStyles(theme);
	return (
		<View style={styles.container}>
			<Image
				priority="high"
				source={require("#assets/images/doodles/withoutProductsInListDoodle.png")}
				style={styles.image}
				contentFit="contain"
				testID="fallback-image"
				alt="homem olhando para dentro do carrinho contendo apenas uma maçã verde"
			/>
			<View>
				<Text
					testID="fallback-text"
					style={styles.text}>
					Adicione um item na sua lista e vamos as compras!
				</Text>
			</View>
		</View>
	);
};
