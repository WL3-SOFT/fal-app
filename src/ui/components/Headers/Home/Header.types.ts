import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";

export interface HeaderProps extends Partial<BottomTabHeaderProps> {
	leftElement?: {
		type: "logo" | "backButton" | "custom";
	};
	rightElement?: {
		type: "button" | "custom";
		action?: () => void;
	};
}
