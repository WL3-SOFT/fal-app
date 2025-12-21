import { Stack } from "expo-router";
import { Header } from "@/ui/components";

export default function ListsLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="[id]"
				options={{
					header(props) {
						return (
							<Header.minimalist
								{...props}
								leftElement={{
									type: "backButton",
								}}
							/>
						);
					},
				}}
			/>
			{/* <Stack.Screen
				name="create"
				options={{
					title: "Criar Lista",
				}}
			/> */}
		</Stack>
	);
}
