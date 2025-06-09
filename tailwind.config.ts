import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: "2rem",
  		screens: {
  			"2xl": "1400px",
  		},
  	},
  	extend: {
  		fontFamily: {
  			'press-start': ['"Press Start 2P"', 'system-ui', 'sans-serif'],
  			'vt323': ['VT323', 'monospace'],
  			'share-tech': ['"Share Tech Mono"', 'monospace'],
  			'orbitron': ['Orbitron', 'sans-serif'],
  			'inter': ['var(--font-inter)'],
  			'cinzel': ['var(--font-cinzel)'],
  		},
  		colors: {
  			background: {
  				DEFAULT: "hsl(var(--background))",
  			},
  			foreground: {
  				DEFAULT: "hsl(var(--foreground))",
  			},
  			border: "hsl(var(--border) / <alpha-value>)",
  			input: "hsl(var(--input) / <alpha-value>)",
  			ring: "hsl(var(--ring) / <alpha-value>)",
  			primary: {
  				DEFAULT: "hsl(var(--primary))",
  				foreground: "hsl(var(--primary-foreground))",
  			},
  			secondary: {
  				DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
  				foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
  			},
  			destructive: {
  				DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
  				foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
  			},
  			muted: {
  				DEFAULT: "hsl(var(--muted) / <alpha-value>)",
  				foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
  			},
  			accent: {
  				DEFAULT: "hsl(var(--accent) / <alpha-value>)",
  				foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
  			},
  			popover: {
  				DEFAULT: "hsl(var(--popover) / <alpha-value>)",
  				foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
  			},
  			card: {
  				DEFAULT: "hsl(var(--card) / <alpha-value>)",
  				foreground: "hsl(var(--card-foreground) / <alpha-value>)",
  			},
  		},
  		borderRadius: {
  			lg: "var(--radius)",
  			md: "calc(var(--radius) - 2px)",
  			sm: "calc(var(--radius) - 4px)",
  		},
  		keyframes: {
  			"accordion-down": {
  				from: { height: "0" },
  				to: { height: "var(--radix-accordion-content-height)" },
  			},
  			"accordion-up": {
  				from: { height: "var(--radix-accordion-content-height)" },
  				to: { height: "0" },
  			},
  			float: {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-10px)' },
  			},
  			glow: {
  				'0%, 100%': { filter: 'brightness(1)' },
  				'50%': { filter: 'brightness(1.2)' },
  			},
  			'pixel-flicker': {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0.8' },
  			},
  			'typewriter': {
  				from: { width: '0' },
  				to: { width: '100%' },
  			},
  			'blink': {
  				'50%': { borderColor: 'transparent' },
  			},
  		},
  		animation: {
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out",
  			float: "float 3s ease-in-out infinite",
  			glow: "glow 2s ease-in-out infinite",
  			'pixel-flicker': 'pixel-flicker 0.5s ease-in-out infinite',
  			'typewriter': 'typewriter 2s steps(40) forwards',
  			'blink': 'blink 0.75s step-end infinite',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
