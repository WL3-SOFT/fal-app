import { useMemo } from "react";
import { Button, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/ui/hooks";
import { Avatar } from "../../Avatar";
import { Logo } from "../../Logo";
import { createHeaderStyles } from "./MinimalistHeader.styles";
import type { HeaderProps } from "./MinimalistHeader.types";

export const MinimalistHeader = (props: HeaderProps) => {
	const { navigation, route, leftElement } = props;

	const shouldShowLogo =
		leftElement?.type === "logo" || route?.name === "index";

	const shouldShowBackButton = leftElement?.type === "backButton";

	const backButtonLabel = route?.path || "Voltar";

	const backButtonCallback = () => {
		navigation?.goBack();
	};

	const insets = useSafeAreaInsets();

	const { theme } = useTheme();

	const styles = useMemo(
		() => createHeaderStyles(theme, insets),
		[theme, insets],
	);

	return (
		<View style={styles.container}>
			{shouldShowLogo && <Logo />}
			{shouldShowBackButton && (
				<Button
					title={backButtonLabel}
					onPress={backButtonCallback}></Button>
			)}
			<Avatar />
		</View>
	);
};
