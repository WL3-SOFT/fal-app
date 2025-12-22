import { useRouter } from "expo-router";
import { View } from "react-native";
import { PlusBox } from "@/ui/assets/icons";
import { Head, IconButton } from "@/ui/components";
import { useTheme } from "@/ui/hooks";
import { createMyListHeaderStyles } from "./Header.styles";
import type { MyListsHeaderProps } from "./Header.types";

export const Header = ({ indicatorText, onCreateList }: MyListsHeaderProps) => {
	useRouter();
	const { theme } = useTheme();
	const style = createMyListHeaderStyles(theme);

	return (
		<View style={style.container}>
			<View testID="page-header-container">
				<View style={style.subContainer}>
					<Head
						id="my-lists-page-title"
						title="Minhas listas"
					/>
					<IconButton
						id="create-list"
						onPress={onCreateList}
						icon={
							<PlusBox
								type="outline"
								color={theme.colors.neutralButton.default}
							/>
						}
					/>
				</View>
				<View style={style.subContainer}>
					<Head
						id="list-count"
						title={indicatorText}
						type="h4"
						color={theme.colors.subtitle}
					/>
				</View>
			</View>
		</View>
	);
};
