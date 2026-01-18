import { useMemo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/ui/hooks";
import { Avatar } from "../../Avatar";
import { BackButton } from "../../Buttons";
import { Logo } from "../../Logo";
import { createHeaderStyles } from "./MinimalistHeader.styles";
import type { HeaderProps } from "./MinimalistHeader.types";

export const MinimalistHeader = (props: HeaderProps) => {
	const { route, leftElement, navigation, rightElement } = props;

	const shouldShowLogo =
		leftElement?.type === "logo" || route?.name === "index";

	const shouldShowBackButton = leftElement?.type === "backButton";

	const shouldShowAvatar = rightElement?.type === "avatar";

	const backButtonLabel = route?.path || "voltar";

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
				<BackButton
					onPress={backButtonCallback}
					id="back-button"
					title={backButtonLabel}
				/>
			)}
			{shouldShowAvatar && <Avatar />}
		</View>
	);
};
