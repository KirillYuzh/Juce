export const merge = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');
