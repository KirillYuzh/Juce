export const THEMES = [
  { value: 'light', title: 'Light', mode: 'light' },
  { value: 'dark', title: 'Dark', mode: 'dark' },
  { value: 'heroui', title: 'HeroUI', mode: 'light' },
  { value: 'heroui-dark', title: 'HeroUI Dark', mode: 'dark' },
] as const;

export type ThemeName = (typeof THEMES)[number]['value'];
