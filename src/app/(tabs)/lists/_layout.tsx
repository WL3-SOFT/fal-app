import { Stack } from "expo-router";

export default function ListsLayout() {
	return (
		<Stack
			screenOptions={{
				headerTitle: "Minhas listas",
			}}>
			<Stack.Screen
				name="index"
				options={{
					title: "Listas",
				}}
			/>
			<Stack.Screen
				name="[id]"
				options={{
					title: "Detalhes da Lista",
				}}
			/>
			<Stack.Screen
				name="create"
				options={{
					title: "Nova Lista",
					ui: "modal",
				}}
			/>
		</Stack>
	);
}
