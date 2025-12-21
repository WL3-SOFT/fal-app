import type {
	NavigationProp,
	ParamListBase,
	RouteProp,
} from "@react-navigation/native";

export interface HeaderProps {
	navigation?: NavigationProp<ParamListBase>;
	route?: RouteProp<ParamListBase>;
	options?: Record<string, unknown>;
	back?: {
		title: string | undefined;
		href: string | undefined;
	};
	leftElement?: {
		type: "logo" | "backButton" | "custom";
	};
	rightElement?: {
		type: "button" | "custom";
		action?: () => void;
	};
}
