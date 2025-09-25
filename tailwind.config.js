/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway', 'system-ui', 'ui-sans-serif', 'Helvetica', 'Arial'],
        heading: ['Raleway', 'system-ui', 'ui-sans-serif', 'Helvetica', 'Arial']
      },
      colors: {
        brand: {
          red: "#D52100",
          ink: "#1C0202",
          white: "#FFFFFF"
        }
      },
      borderRadius: { 
        xl: "1rem", 
        "2xl": "1.25rem" 
      },
      boxShadow: {
        card: "0 6px 20px rgba(0,0,0,0.06)",
        focus: "0 0 0 3px rgba(213,33,0,0.25)",
        "red-sm": "0 1px 2px 0 rgba(213, 33, 0, 0.05)"
      }
    }
  },
  plugins: [],
};
