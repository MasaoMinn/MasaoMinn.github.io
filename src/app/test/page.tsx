import { readFile } from "fs/promises";
import path from "path";
import BubbleBoxPlaygroundClient from "../tools/sunny-zy-ui/matter/BubbleBoxPlaygroundClient";

async function loadBubbleBoxSourceCode() {
  const sourcePath = path.join(
    process.cwd(),
    "components",
    "ui",
    "matter",
    "BubbleBox.tsx",
  );

  try {
    return await readFile(sourcePath, "utf-8");
  } catch {
    return "";
  }
}

export default async function TestPage() {
  const bubbleBoxSourceCode = await loadBubbleBoxSourceCode();
  return <BubbleBoxPlaygroundClient bubbleBoxSourceCode={bubbleBoxSourceCode} />;
}
