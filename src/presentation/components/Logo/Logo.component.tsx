import { Image } from "expo-image";

export const Logo = () => {
	return (
		<Image
			style={{
				width: 100,
				// biome-ignore lint/style/noMagicNumbers: Valor padrão para aspectRatio
				aspectRatio: 1 / 0.5,
			}}
			priority="high"
			source={require("@/presentation/assets/images/splash-icon-light.png")}
		/>
	);
};
