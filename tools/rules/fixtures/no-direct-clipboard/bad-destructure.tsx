export async function readClipboard() {
  const { clipboard } = navigator;
  return clipboard.readText();
}
