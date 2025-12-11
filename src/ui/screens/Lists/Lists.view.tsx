import { Link } from "expo-router";
import { SafeAreaView, Text } from "react-native";
// import { useTheme } from "@/ui/hooks";

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
