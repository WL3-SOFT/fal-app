import type { spacing, typography } from "../themes/tokens";

interface Colors {
	primary: string;
	primaryLight: string;
	primaryDark: string;

	background: string;
	surface: string;
	card: string;

	text: string;
	textSecondary: string;
	textDisabled: string;

	error: string;
	success: string;
	warning: string;
	info: string;

	border: string;
	divider: string;

	tab: {
		active: {
			icon: string;
			background: string;
		};
		inactive: {
			icon: string;
			background: string;
		};
	};

	button: {
		success: string;
		error: string;
		disabled: string;
		default: string;
	};
}

interface BorderRadius {
	sm: number;
	md: number;
	lg: number;
	xl: number;
	full: number;
}

interface Shadows {
	sm: {
		shadowColor: string;
		shadowOffset: { width: number; height: number };
		shadowOpacity: number;
		shadowRadius: number;
		elevation: number;
	};
	md: {
		shadowColor: string;
		shadowOffset: { width: number; height: number };
		shadowOpacity: number;
		shadowRadius: number;
		elevation: number;
	};
	lg: {
		shadowColor: string;
		shadowOffset: { width: number; height: number };
		shadowOpacity: number;
		shadowRadius: number;
		elevation: number;
	};
}

export interface Theme {
	colors: Colors;
	spacing: typeof spacing;
	typography: typeof typography;
	borderRadius: BorderRadius;
	shadows: Shadows;
}
