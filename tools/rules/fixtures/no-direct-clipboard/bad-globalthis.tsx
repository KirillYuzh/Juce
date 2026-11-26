export async function copy(text: string) {
  await globalThis.navigator.clipboard.writeText(text);
}
