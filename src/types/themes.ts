import type { spacing, typography } from "../ui/theme/tokens";

interface Colors {
	primary: string;
	secondary: string;
	tertiary: string;

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

	title: string;
	subtitle: string;

	border: string;
	divider: string;

	highlightPrice: string;

	fallback: {
		text: string;
		icon: string;
	};

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

	neutralButton: {
		default: string;
	};

	saveSummary: {
		title: string;
		price: string;
		count: string;
	};

	legend: {
		icon: string;
		text: string;
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
