import { useMemo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/ui/hooks";
import { Avatar } from "../../Avatar";
import { TextButton } from "../../Buttons";
import { Logo } from "../../Logo";
import { createHeaderStyles } from "./PrincipalHeader.styles";
import type { HeaderProps } from "./PrincipalHeader.types";

export const PrincipalHeader = (props: HeaderProps) => {
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
				<TextButton
					title={backButtonLabel}
					onPress={backButtonCallback}
					variant="text"
				/>
			)}
			<Avatar />
		</View>
	);
};
