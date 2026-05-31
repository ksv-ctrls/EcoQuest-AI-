// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0c0a1a",
        card: {
          primary: "#1a1829",
          secondary: "#2a2837",
        },
        accent: {
          purple: "#763bf3",
          pink: "#9b59b6",
        },
        text: {
          primary: "#ffffff",
          secondary: "#a9a6b8",
        },
      },
      boxShadow: {
        neon: "0 20px 50px rgba(0,0,0,0.8)",
        "neon-soft": "0 12px 30px rgba(118,59,243,0.8)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(ellipse 50% 40% at 50% 25%, rgba(118,59,243,0.35), transparent)",
      },
    },
  },
  plugins: [],
};
