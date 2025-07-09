export const theme = {
  colors: {
    primary: "#000000",        // True black for background
    secondary: "#0D0D0D",      // Near-black for cards/sections
    accent: "#00BFFF",         // Logo blue (Deep Sky Blue)
    accentGradientStart: "#00BFFF", // Start of gradient (bright blue)
    accentGradientEnd: "#B0E0E6",   // End of gradient (light blue/cyan tint)
    accentTeal: "#00CED1",     // Dark Turquoise - complements the blue theme
    accentCyan: "#1E90FF",     // Dodger Blue - slightly deeper blue variant
    green: "#22c55e",          // Tailwind green-500
    greenForeground: "#FFFFFF", // White text for green backgrounds
    purple: "#a855f7",         // Tailwind purple-500
    purpleForeground: "#FFFFFF", // White text for purple backgrounds
    text: "#FFFFFF",           // Pure white text
    textMuted: "#B0B0B0",      // Slightly cooler muted text
    border: "#1F1F1F",         // Soft dark border
  },
  glassmorphism: {
    background: "rgba(0, 0, 0, 0.6)",         // Transparent black
    border: "rgba(255, 255, 255, 0.08)",      // Subtle light border
    backdrop: "blur(14px)",                   // Slightly stronger blur for depth
  },
}
