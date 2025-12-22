import { captureException } from "@sentry/react-native";
import { Text, View } from "react-native";

export const NotFoundView = () => {
	captureException(new Error("Not Found"));
	return (
		<View>
			<Text>Not Found</Text>
		</View>
	);
};
