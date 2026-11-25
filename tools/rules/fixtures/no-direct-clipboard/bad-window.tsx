export async function copy(text: string) {
  await window.navigator.clipboard.writeText(text);
}
