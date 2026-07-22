import { Button, type ButtonProps } from "@/components/ui/button";
import type { ThemePalette } from "@/app/tools/sunny-zy-ui/theme-style";
import styled, { css } from "styled-components";

type ThemedButtonProps = ButtonProps & {
  palette?: ThemePalette;
};

const cssVarPalette: ThemePalette = {
  backgroundColor: "var(--background)",
  color: "var(--foreground)",
  borderColor: "var(--border)",
  extraColor: "var(--theme-button-bg, var(--primary))",
  backgroundColor2: "var(--secondary)",
  color2: "var(--secondary-foreground)",
  extraColor2: "var(--theme-button-bg-hover, var(--accent))",
};

const variantStyles = (
  variant: ButtonProps["variant"] | undefined,
  palette: ThemePalette,
) => {
  if (variant === "ghost") {
    return css`
      background-color: transparent !important;
      color: ${palette.color2} !important;
      border: 1px solid transparent !important;
      &:hover {
        background-color: ${palette.backgroundColor} !important;
        color: ${palette.color} !important;
      }
    `;
  }

  if (variant === "default") {
    return css`
      background-color: ${palette.extraColor} !important;
      color: ${palette.color} !important;
      border: 1px solid ${palette.borderColor} !important;
      &:hover {
        background-color: ${palette.extraColor2} !important;
      }
    `;
  }

  return css`
    background-color: ${palette.backgroundColor} !important;
    color: ${palette.color2} !important;
    border: 1px solid ${palette.borderColor} !important;
    &:hover {
      background-color: ${palette.backgroundColor} !important;
      color: ${palette.color} !important;
    }
  `;
};

const StyledButton = styled(Button) <{
  $palette: ThemePalette;
  $variant: ButtonProps["variant"] | undefined;
}>`
  && {
    ${({ $variant, $palette }) => variantStyles($variant, $palette)}
    border-radius: 0.75rem !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
    transition: box-shadow 0.2s ease, transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
  }

  &&:hover {
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
    transform: translateY(-1px);
  }

  &&:active {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
    transform: translateY(0);
  }

  &&:focus-visible {
    box-shadow: 0 0 0 2px ${({ $palette }) => $palette.extraColor2} !important;
  }
`;

export function ThemedButton({
  palette,
  variant = "default",
  ...props
}: ThemedButtonProps) {
  const effectivePalette = palette ?? cssVarPalette;

  return (
    <StyledButton
      {...props}
      variant={variant}
      $palette={effectivePalette}
      $variant={variant}
    />
  );
}

export default ThemedButton;
