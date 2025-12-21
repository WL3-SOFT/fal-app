import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import type {
	NavigationProp,
	ParamListBase,
	RouteProp,
} from "@react-navigation/native";
import type { ReactNode } from "react";

export interface NativeStackHeaderProps {
	navigation: NavigationProp<ParamListBase>;
	route: RouteProp<ParamListBase>;
	options: NativeStackNavigationOptions;
	back?: {
		title: string | undefined;
		href: string | undefined;
	};
}

export interface NativeStackNavigationOptions {
	title?: string;
	header?: (props: NativeStackHeaderProps) => ReactNode;
	headerShown?: boolean;
	headerTitle?: string | ((props: { children: string }) => ReactNode);
	headerTitleAlign?: "left" | "center";
	headerBackTitle?: string;
	headerBackVisible?: boolean;
	headerBackTitleVisible?: boolean;
	headerRight?: (props: { tintColor?: string }) => ReactNode;
	headerLeft?: (props: { tintColor?: string }) => ReactNode;
	headerTintColor?: string;
	headerStyle?: object;
	headerTitleStyle?: object;
	headerBackTitleStyle?: object;
	headerShadowVisible?: boolean;
	headerTransparent?: boolean;
	headerBlurEffect?: "light" | "dark" | "regular";
	presentation?:
		| "card"
		| "modal"
		| "transparentModal"
		| "containedModal"
		| "containedTransparentModal"
		| "fullScreenModal"
		| "formSheet";
	animation?:
		| "default"
		| "fade"
		| "flip"
		| "slide_from_right"
		| "slide_from_left"
		| "slide_from_bottom"
		| "none";
	gestureEnabled?: boolean;
	fullScreenGestureEnabled?: boolean;
	statusBarStyle?: "auto" | "inverted" | "light" | "dark";
	statusBarHidden?: boolean;
	statusBarAnimation?: "fade" | "none" | "slide";
	contentStyle?: object;
	orientation?:
		| "default"
		| "all"
		| "portrait"
		| "portrait_up"
		| "portrait_down"
		| "landscape"
		| "landscape_left"
		| "landscape_right";
}

export type UnifiedHeaderProps = BottomTabHeaderProps | NativeStackHeaderProps;
