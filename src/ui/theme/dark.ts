import type { Theme } from "../../types";
import { colors, spacing, typography } from "./tokens";

export const darkTheme: Theme = {
	colors: {
		primary: colors.primary["1"],
		secondary: colors.primary["2"],
		tertiary: colors.primary["3"],
		saveSummary: {
			title: colors.primary["10"],
			price: colors.neutral.white,
			count: colors.neutral.white,
		},

		background: colors.neutral["10"],
		surface: colors.neutral["2"],
		card: colors.neutral["2"],

		text: colors.neutral["10"],
		textSecondary: colors.neutral["8"],
		textDisabled: colors.neutral["6"],

		error: colors.tertiary["9"],
		success: colors.primary["9"],
		warning: colors.secondary["9"],
		info: colors.primary["5"],

		border: colors.neutral["6"],
		divider: colors.neutral["6"],
		tab: {
			active: {
				icon: colors.neutral["10"],
				background: colors.primary["6"],
			},
			inactive: {
				icon: colors.neutral["6"],
				background: colors.neutral["2"],
			},
		},
		button: {
			default: colors.primary["6"],
			success: colors.primary["6"],
			error: colors.primary["6"],
			disabled: colors.primary["6"],
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
			shadowOpacity: 0.3,
			shadowRadius: 2,
			elevation: 1,
		},
		md: {
			shadowColor: colors.neutral["10"],
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.4,
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
