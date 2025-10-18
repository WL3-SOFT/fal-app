export const typography = {
	fontFamily: {
		regular: "Inter-Regular",
		medium: "Inter-Medium",
		semiBold: "Inter-SemiBold",
		bold: "Inter-Bold",
	},
	fontSize: {
		// Micro (2-4px) - Decorative use only
		xs1: 2,
		xs2: 3,
		xs3: 4,

		// Extra Small (8-12px) - Labels, captions, metadata
		sm1: 8,
		sm2: 10,
		sm3: 12,

		// Small (14-20px) - Secondary text, buttons, forms
		md1: 14,
		md2: 16, // ⭐ Standard body text (default)
		md3: 18,
		md4: 20,

		// Medium (24-32px) - Headings, card titles
		lg1: 24,
		lg2: 28,
		lg3: 32,

		// Large (40-64px) - Large headings (h1-h3)
		xl1: 40,
		xl2: 48,
		xl3: 56,
		xl4: 64,

		// Extra Large (80-128px) - Display headings, hero text
		xxl1: 80,
		xxl2: 96,
		xxl3: 112,
		xxl4: 128,

		// Maximum (160px) - Hero/Display (rare use)
		xxxl1: 160,
	},
	lineHeight: {
		// Micro
		xs1: 4, // 2x ratio (minimum readable)
		xs2: 4,
		xs3: 6, // 1.5x ratio

		// Extra Small
		sm1: 12, // 1.5x ratio
		sm2: 14, // 1.4x ratio
		sm3: 18, // 1.5x ratio

		// Small
		md1: 20, // ~1.43x ratio
		md2: 24, // 1.5x ratio ⭐ Default body
		md3: 28, // ~1.56x ratio
		md4: 28, // 1.4x ratio

		// Medium
		lg1: 32, // 1.33x ratio
		lg2: 36, // ~1.29x ratio
		lg3: 40, // 1.25x ratio

		// Large
		xl1: 48, // 1.2x ratio
		xl2: 56, // ~1.17x ratio
		xl3: 64, // ~1.14x ratio
		xl4: 72, // ~1.13x ratio

		// Extra Large
		xxl1: 96, // 1.2x ratio
		xxl2: 112, // ~1.17x ratio
		xxl3: 128, // ~1.14x ratio
		xxl4: 152, // ~1.19x ratio

		// Maximum
		xxxl1: 192, // 1.2x ratio
	},

	fontWeight: {
		regular: "400",
		medium: "500",
		semiBold: "600",
		bold: "700",
	} as const,
} as const;
