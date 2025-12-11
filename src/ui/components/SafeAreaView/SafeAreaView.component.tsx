import {
	type NativeSafeAreaViewInstance,
	SafeAreaView as SafeAreaViewComponent,
	type SafeAreaViewProps,
} from "react-native-safe-area-context";

export const SafeAreaView = (
	props: NativeSafeAreaViewInstance & SafeAreaViewProps,
) => {
	return <SafeAreaViewComponent {...props} />;
};
