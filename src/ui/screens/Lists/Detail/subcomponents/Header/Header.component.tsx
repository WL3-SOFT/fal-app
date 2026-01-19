import { useRouter } from "expo-router";
import { View } from "react-native";
import { VerticalDots } from "@/ui/assets/icons";
import { Head, IconButton } from "@/ui/components";
import { useTheme } from "@/ui/hooks";
import { createListDetailHeaderStyles } from "./Header.styles";
import type { ListDetailHeaderProps } from "./Header.types";

export const Header = ({ listName, headerSubTitle }: ListDetailHeaderProps) => {
	useRouter();
	const { theme } = useTheme();
	const style = createListDetailHeaderStyles(theme);

	return (
		<View style={style.container}>
			<View testID="page-header-container">
				<View style={style.subContainer}>
					<Head
						id="my-lists-page-title"
						title={listName}
						type="h3"
					/>
					<IconButton
						id="create-list-button"
						onPress={() => console.log("oi")}
						icon={<VerticalDots />}
					/>
				</View>
				<View style={style.subContainer}>
					<Head
						id="list-count"
						title={headerSubTitle}
						type="h6"
						color={theme.colors.legend.text}
					/>
				</View>
			</View>
		</View>
	);
};
