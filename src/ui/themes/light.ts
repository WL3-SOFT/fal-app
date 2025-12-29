import type { Theme } from "../../types";
import { colors, spacing, typography } from "./tokens";

export const lightTheme: Theme = {
	colors: {
		primary: colors.primary["6"],
		secondary: colors.secondary["6"],
		tertiary: colors.tertiary["6"],

		background: colors.neutral.white,
		surface: colors.neutral["2"],
		card: colors.neutral["2"],

		text: colors.neutral["10"],
		textSecondary: colors.neutral["8"],
		textDisabled: colors.neutral["6"],

		error: colors.primary["1"],
		success: colors.primary["2"],
		warning: colors.primary["3"],
		info: colors.primary["4"],

		highlightPrice: colors.primary["8"],

		border: colors.neutral["4"],
		divider: colors.neutral["4"],
		tab: {
			active: {
				icon: colors.primary["6"],
				background: colors.primary["6"],
			},
			inactive: {
				icon: colors.neutral["9"],
				background: colors.neutral["2"],
			},
		},
		button: {
			success: colors.primary["6"],
			error: colors.primary["1"],
			disabled: colors.neutral["4"],
			default: colors.primary["6"],
		},
		neutralButton: {
			default: colors.neutral["10"],
		},

		fallback: {
			text: colors.neutral["9"],
			icon: colors.neutral["9"],
		},
		title: colors.neutral["10"],
		subtitle: colors.neutral["7"],
		saveSummary: {
			title: colors.primary["10"],
			price: colors.neutral.white,
			count: colors.neutral.white,
		},
		legend: {
			icon: colors.neutral["10"],
			text: colors.neutral["10"],
		},
	},
	spacing,
	typography,
	borderRadius: {
		sm: 4,
		md: 8,
		lg: 12,
		xl: 16,
		full: 9999,
	},
	shadows: {
		sm: {
			shadowColor: colors.neutral["10"],
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.05,
			shadowRadius: 2,
			elevation: 1,
		},
		md: {
			shadowColor: colors.neutral["10"],
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 4,
			elevation: 3,
		},
		lg: {
			shadowColor: colors.neutral["10"],
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.5,
			shadowRadius: 8,
			elevation: 5,
		},
	},
};
