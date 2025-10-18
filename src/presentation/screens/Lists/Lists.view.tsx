import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "@/presentation/components";
// import { useTheme } from "@/presentation/hooks";

export const ListsView = () => {
	// const { themeMode, theme } = useTheme();
	return (
		<SafeAreaView>
			<Text>Lists</Text>
			<Link
				href={{
					pathname: "/lists/[id]",
					params: {
						id: "1",
					},
				}}>
				Create list
			</Link>
		</SafeAreaView>
	);
};
