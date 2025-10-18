import { Tabs } from "expo-router";
import {
	Home,
	HomeOutline,
	ListBox,
	ListBoxOutline,
} from "@/presentation/assets/icons";
import { Header } from "@/presentation/components";
import { useTheme } from "@/presentation/hooks";

export default function TabLayout() {
	const { theme } = useTheme();
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: theme.colors.tab.active.icon,
				tabBarInactiveTintColor: theme.colors.tab.inactive.icon,
				header: (props) => <Header {...props} />,
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size, focused }) =>
						focused ? (
							<Home
								size={size}
								color={color}
							/>
						) : (
							<HomeOutline
								size={size}
								color={color}
							/>
						),
				}}
			/>
			<Tabs.Screen
				name="lists"
				options={{
					title: "Listas",
					headerShown: false,
					tabBarIcon: ({ color, size, focused }) =>
						focused ? (
							<ListBox
								size={size}
								color={color}
							/>
						) : (
							<ListBoxOutline
								size={size}
								color={color}
							/>
						),
				}}
			/>
		</Tabs>
	);
}
