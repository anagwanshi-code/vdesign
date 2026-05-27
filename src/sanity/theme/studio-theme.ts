import { buildLegacyTheme } from "sanity";

const tokens = {
  black: "#0a0a0b",
  surface: "#121316",
  elevated: "#1a1c22",
  white: "#f5f3ef",
  muted: "#9ca3af",
  peacock: "#0088a9",
  saffron: "#e8a838",
  magenta: "#9b4d6a",
  danger: "#c45c5c",
};

export const vDesignStudioTheme = buildLegacyTheme({
  "--black": tokens.black,
  "--white": tokens.white,
  "--gray": tokens.muted,
  "--gray-base": tokens.muted,
  "--component-bg": tokens.elevated,
  "--component-text-color": tokens.white,
  "--brand-primary": tokens.peacock,
  "--default-button-color": tokens.muted,
  "--default-button-primary-color": tokens.peacock,
  "--default-button-success-color": tokens.peacock,
  "--default-button-warning-color": tokens.saffron,
  "--default-button-danger-color": tokens.danger,
  "--state-info-color": tokens.peacock,
  "--state-success-color": tokens.peacock,
  "--state-warning-color": tokens.saffron,
  "--state-danger-color": tokens.danger,
  "--main-navigation-color": tokens.surface,
  "--main-navigation-color--inverted": tokens.white,
  "--focus-color": tokens.peacock,
});
