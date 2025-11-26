import { createTheme } from "@mantine/core";

// Create a custom Mantine theme with your purple accent colors
export const theme = createTheme({
	/** Primary color - used for primary buttons, active states, etc. */
	primaryColor: "violet",

	/** Color scheme */
	colors: {
		// Override violet colors to match your design
		violet: [
			"#f5f3ff", // 0 - lightest
			"#ede9fe", // 1
			"#ddd6fe", // 2
			"#c4b5fd", // 3
			"#a78bfa", // 4
			"#8b5cf6", // 5 - your --accent-light
			"#7c3aed", // 6 - your --accent (primary shade)
			"#6d28d9", // 7 - your --accent-hover
			"#5b21b6", // 8
			"#4c1d95", // 9 - darkest
		],
	},

	/** Primary shade (which shade of the primary color to use by default) */
	primaryShade: { light: 6, dark: 6 },

	/** Default radius for all components */
	defaultRadius: "md",

	/** Font family */
	fontFamily:
		'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

	/** Heading styles */
	headings: {
		fontFamily:
			'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
		fontWeight: "600",
	},

	/** Black & white colors for dark/light mode */
	black: "#000000",
	white: "#ffffff",

	/** Other theme settings */
	respectReducedMotion: true,
});
