export const THEMES = [
  { value: 'palette-wasabi', title: 'Wasabi', mode: 'light' },
  { value: 'palette-wasabi-dark', title: 'Wasabi Dark', mode: 'dark' },
] as const;

export type GeneratedThemeName = (typeof THEMES)[number]['value'];
