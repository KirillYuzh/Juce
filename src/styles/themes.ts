export const THEMES = [
  { value: 'light', title: 'Light', mode: 'light' },
  { value: 'dark', title: 'Dark', mode: 'dark' },
  { value: 'heroui', title: 'HeroUI', mode: 'light' },
  { value: 'heroui-dark', title: 'HeroUI Dark', mode: 'dark' },
  { value: 'ocean', title: 'Ocean', mode: 'dark' },
  { value: 'dune', title: 'Dune', mode: 'dark' },
  { value: 'dusk', title: 'Dusk', mode: 'dark' },
  { value: 'silk', title: 'Silk', mode: 'dark' },
  { value: 'aurora', title: 'Aurora', mode: 'dark' },
] as const;

export type ThemeName = (typeof THEMES)[number]['value'];
