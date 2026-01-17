
import { HTMLMotionProps } from "motion/react";
import { BoldButton } from "./MotionComponents";
import { useTheme, lightTheme, darkTheme } from "./ThemeProvider";
type ThemedButtonProps = HTMLMotionProps<"button">;
export default function ThemedButton({ children, ...rest }: ThemedButtonProps) {
  const { theme, currentTheme } = useTheme();
  const buttonStyles = {
    borderRadius: "12px",
    fontWeight: 500,
    transition: "all 0.3s ease",
    borderWidth: "2px",
    backgroundColor: theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor,
    color: theme === 'light' ? lightTheme[currentTheme].color : darkTheme[currentTheme].color,
    transform: "translateY(0)",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
  };
  return (
    <BoldButton {...rest} style={buttonStyles}>
      {children}
    </BoldButton>
  );
}