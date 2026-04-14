import { Button, type ButtonProps } from "@/components/ui/button";
import type { ThemePalette } from "@/app/sunny-zy-ui/theme-style";
import styled, { css } from "styled-components";

type ThemedButtonProps = ButtonProps & {
  palette?: ThemePalette;
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
      color: ${palette.backgroundColor} !important;
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
  if (!palette) {
    return <Button {...props} variant={variant} />;
  }

  return (
    <StyledButton
      {...props}
      variant={variant}
      $palette={palette}
      $variant={variant}
    />
  );
}

export default ThemedButton;
